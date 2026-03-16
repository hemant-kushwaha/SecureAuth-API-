const redis = require('redis')

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17570.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: process.env.R_PORT
    }
})

// const redisClient2 = redis.createClient({
//     url:"redis://username:password@host:port"
    
// })



// async function connectRedis (){
//     await redisClient.connect();
//     console.log("Redis DB connected succesfully")
// }

// connectRedis();

module.exports = redisClient;