const express = require('express');
const bcrypt = require('bcrypt');
const validUserLogin = require('../Validators/validateuserLogin')
const validUser = require('../Validators/validateUser')
const redisClient = require('../Configs/redisConfigs')
const jwt = require('jsonwebtoken');
const userAuth = require('../Middleware/userAuth')




const authRouter = express.Router();
const User = require('../Models/User')


authRouter.post("/register", async (req, res) => {
  try {
    validUser(req.body);

   req.body.password = await bcrypt.hash(req.body.password,10)
    await User.create(req.body);
    res.send("user registered succesfully");
    
  } catch (error) {
    res.send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  }
});

authRouter.post("/login",async (req, res) => {
  try {

    validUserLogin(req.body)
    const user = await User.findOne({email:req.body.email})

    if(!(req.body.email === user.email))
        throw new Error("Invalid Credentials")

    const IsAllowed = await user.verifyPassword(req.body.password);    
    if(!IsAllowed)
      throw new Error("Password Incorrect")

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
     
    res.cookie("accessToken",accessToken,{
      maxAge: 2*60*1000
    })
    res.cookie("refreshToken",refreshToken,{
      // maxAge: 7 * 24 * 60 * 60 * 1000
      maxAge: 5*60*1000
    })
    res.send("User logged IN succesfully");
    
  } catch (error) {
    res.status(400).send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  }
})

authRouter.post("/logout",async (req, res) => {
  try {

    const {accessToken,refreshToken} = req.cookies
    // console.log(token)
    const payload_AT = jwt.decode(accessToken)
    const payload_RT = jwt.decode(refreshToken)

    // console.log(payload)
    
    // Store access token in Redis
    await redisClient.set(`access:${accessToken}`,"Blocked")
    // await redisClient.expire(`token:${token}`,1800)
    await redisClient.expireAt(`access:${accessToken}`,payload_AT.exp)

    // // Store refresh token in Redis
    await redisClient.set(`refresh:${refreshToken}`,"Blocked");
    await redisClient.expireAt(`refresh:${refreshToken}`,payload_RT.exp)


    res.cookie("accessToken",null,{expires:new Date(Date.now())})
    res.cookie("refreshToken",null,{expires:new Date(Date.now())})

    res.send("User logged out succesfully");
    
  } catch (error) {
    res.send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  }
})

authRouter.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) 
      throw new Error("No refresh token");

    const payload =  jwt.verify(refreshToken,process.env.REFRESH_SECRET);

    const IsBlocked = await redisClient.exists(`refresh:${refreshToken}`)

    if(IsBlocked){
        throw new Error("Refresh Token Blocked")
    }  
    const accessToken = jwt.sign({_id: payload._id }, process.env.SECRET_KEY,{ expiresIn: "2m" });

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
    });
    res.send("Access token refreshed");
  } catch (error) {
    res.status(401).send({
      success: false,
      Error: error.message,
    });
  }
});


module.exports =  authRouter;