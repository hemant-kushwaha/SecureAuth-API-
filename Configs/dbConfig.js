const mongoose = require('mongoose');


const url = process.env.DB_CONNECT_KEY;

async function connectDB() {
    await mongoose.connect(url)   
}

module.exports = connectDB;
