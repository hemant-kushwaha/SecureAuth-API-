const jwt = require('jsonwebtoken');
const User = require("../Models/User");
const redisClient = require('../Configs/redisConfigs')


const userAuth = async(req,res,next)=>{
    try {
    const {accessToken} = req.cookies;
    if(!accessToken)
        throw new Error("Token Doesn't Exists")
       
    const payload =  jwt.verify(accessToken,process.env.SECRET_KEY)// throw error when not verified
    const {_id} = payload;
    if(!_id){
      throw new Error("ID is Missing")
    }
    const user = await User.findById(payload._id);
    req.user = user; // --> TOp Level Approach Bro

    const IsBlocked = await redisClient.exists(`access:${accessToken}`)

    if(IsBlocked){
        throw new Error("Access Token Blocked")
    }
    next();
    console.log("User Authenticate Successfully")
    } catch (error) {
     console.log(error.message)
     res.send(error.message)   
    }
}

module.exports = userAuth;