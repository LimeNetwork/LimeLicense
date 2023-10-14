const mongoose = require('mongoose');
const winston = require('winston');
// const { connect } = require('socket.io-client');

/**
 * ---- DATABASE DEFINITION ----
 * 
 * Connect to Databse using .env file
 * DB_STRING
 */

connectDB = async(logger) => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;