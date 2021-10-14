/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
const winston = require('winston');
const appRoot = require('app-root-path');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

winston.addColors(colors)

const options = {
    file: {
        level: 'info',
        name: 'app.info',
        filename: `${appRoot}/logs/info.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true
    },
    errorFile: {
        level: 'error',
        name: 'file.error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        colorize: false
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        timestamp: () => new Date(),
        colorize: true
    }
};


const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File(options.file),
]


const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
    meta: true,
    expressFormat: true,
    colorize: true,
    msg: `HTTP {{req.method}} {{req.url}}`, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    exitOnError: false // do not exit on handled exceptions
})

Logger.stream = {
    
    write(message, encoding) {
        Logger.info(message.replace(/\n$/, ''));
    }

};

Logger.combinedFormat = function (error, req, res) {
    return `${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
};

module.exports = Logger;