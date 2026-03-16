const express = require("express");
require('dotenv').config();
const connectDB = require("./Configs/dbConfig");
const User = require("./Models/User");
const CookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userAuth = require('./Middleware/userAuth')
const authRouter = require('./Routes/authRouter')
const userRouter = require('./Routes/userRouter')
const redisClient = require('./Configs/redisConfigs')
const rateLimiter = require('./Middleware/rateLimiter')


const app = express();

// console.log(process.env)
// mongoose.connect() ->Uses the default global connection. If you call it twice, second one overwrites the first.

app.use(express.json());
app.use(CookieParser());

app.use(rateLimiter)

app.use("/auth",authRouter)
app.use("/user",userRouter)

app.get("/info",userAuth,async (req, res) => {
  try {
   const payload =  jwt.verify(req.cookies.accessToken,process.env.SECRET_KEY)// throw error when not verified
   const users = await User.find();
    res.send(users);
    console.log(payload)
    
  } catch (error) {
    res.send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  }
})



async function startServer() {
  try {

    await Promise.all([redisClient.connect(),connectDB()])
    console.log("Database Connected SuccessFully") 

    app.listen(process.env.PORT, () => {
      console.log("Server running on port 8000");
    });
  } 
  catch (error) {
    console.log("Failed to start server ", error.message);
  }
}
startServer();
