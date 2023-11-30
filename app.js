/**
 * Import libraries, routers, controllers, database connection
 */

const dotenv = require('dotenv')
dotenv.config()

// Import Libraries
const express = require('express');
var http = require('http');
var timeout = require('connect-timeout')

const logger = require("./lib/logger");
const morgan = require("./middlewares/morgan");

// Import Routers
const apiRouter = require('./routes/api');

// Import Database
const connectDB = require('./config/database');

// Connect to Database
connectDB(logger);

app = express();

httpServer = http.createServer(app);

// Reveal ip when req.ip
app.set('trust proxy', true)

// Timeout

app.use(timeout('25s'));

/**
 *--------- GENERAL SETUP -------------
 */
// Morgan Logger
app.use(morgan);

// add req logger
app.use((req, res, next) => {
    req.logger = logger;
    req.delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    next();
});

// Static folder
app.use(express.static('public'));
app.use(haltOnTimedout);

// view engine ejs
app.set('view engine', 'ejs')
app.use(haltOnTimedout);

// Express body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))
app.use(haltOnTimedout);
// Set up cors - GET, POST, PUT, PATCH, and other REQUEST

function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
        next();
    } else {
        return res.status(408).json({
            success: false,
            message: 'Request Timeout'
        })
    }
}
app.use(haltOnTimedout);

// Set up Routers
app.use('/api', apiRouter); // API Router

app.use(haltOnTimedout);

app.use(haltOnTimedout);

async function main() {

    await Promise.all([
        httpServer.listen(process.env.HTTP_PORT, () => console.log('App is listening on url http://' + process.env.API_URL))
    ])
}

main();