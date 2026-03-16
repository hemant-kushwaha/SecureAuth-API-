const jwt = require('jsonwebtoken');
const User = require("../Models/User");
const redisClient = require('../Configs/redisConfigs')

//Total time
const windowSize = 5*1000; //60 seconds
const maxRequest = 3;


async function rateLimiter(req,res,next) {
     try {
        const key = `rateLimit:${req.ip}`;
        const current_Time = Date.now();
        const windowTime = current_Time-windowSize;

        //Remove old request
        await redisClient.zRemRangeByScore(key,0,windowTime)

        //Count Requests
        const requestCount = await redisClient.zCard(key);
        
        //Blocking on exceed
        if(requestCount>=maxRequest)
             return res.status(429).json({message: "Too many requests. Try again later."});
        
        //Add Current request
        const requestId = `Z${current_Time}:${Math.random()}`;
        await redisClient.zAdd(key,{
            score:current_Time,
            value: requestId

        })

        //Set expiration
        await redisClient.expire(key, windowSize/1000)
        next();

    } catch (error) {
     console.log(error.message)
     res.send(error.message)   
    }
}

// const requestId = `${Date.now()}-${Math.random()}`;

/* 
# RateLimiter with fixed Windows Size
async function rateLimiter(req,res,next) {
     try {
        const ip = req.ip;
        const count = await redisClient.incr(ip)

         if(count==1){
            redisClient.expire(3600) // In sec
        }

        if(count>3)
            throw new Error("Rate Limiter : User limit exceeded")

       console.log(ip)
    next();
    } catch (error) {
     console.log(error.message)
     res.send(error.message)   
    }
}

*/
 
module.exports = rateLimiter;