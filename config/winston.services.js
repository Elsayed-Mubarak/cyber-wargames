/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable require-await */
const winston = require('winston');
const Log = require('./../logs/log');

class LoggerService {

    constructor (route) {
        this.log_data = null;
        this.options = {
            info: {
                level: 'info',
                filename: `./logs/${route}-info.log`,
                // filename: './logs/logs-info.log',
                handleExceptions: true,
                json: false,
                maxsize: 5242880, // 5MB
                maxFiles: 100,
                colorize: true
            },
            error: {
                level: 'error',
                filename: `./logs/${route}-error.log`,
                // filename: './logs/logs-error.log',
                handleExceptions: true,
                json: true,
                maxsize: 5242880, // 5MB
                maxFiles: 100,
                colorize: true

            },
            console: {
                level: 'debug',
                handleExceptions: true,
                json: true,
                colorize: true,
                prettyPrint: true
            },
            console: {
                handleExceptions: true,
                level: 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.align(),
                    winston.format.colorize(),
                    messageFormate(this.route)

                )
            }
        };
        this.route = route;

        const infoLogger = new winston.createLogger({
            // levels: {
            //     info: 1
            // },
            transports: [
                new winston.transports.File(this.options.info),
                new winston.transports.Console({ level: 'info', format: winston.format.colorize({ all: true, colors: { info: 'blue' }, level: 'info', message: true }) })
            ],
            format: winston.format.combine(
                messageFormate(this.route)
            )

        });

        const errorLogger = new winston.createLogger({
            // levels: {
            //     error: 3
            // },
            transports: [
                new winston.transports.File(this.options.error),
                new winston.transports.Console({ level: 'error', format: winston.format.colorize({ all: true, colors: { error: 'red' }, level: 'error', message: true }) })
            ],
            format: winston.format.combine(
                messageFormate(this.route)
            )
        });

        this.infoLogger = infoLogger;
        this.errorLogger = errorLogger;
    }


    async info (message, obj) {
        this.infoLogger.info(message, { obj });
    }
    async error (message, state, label) {
        let logError = new Log();
        logError.add(state, label, message);
        await logError.save();
        this.errorLogger.error(message);
    }
}

dateFormat = () => {
    return new Date(`${new Date().toString().split('GMT')[0]} UTC`).toISOString().split('.')[0].replace('T', ' ');
    // return new Date(Date.now()).toUTCString();
};

messageFormate = (route) => {
    return winston.format.printf((info) => {
        const message = info.obj ? JSON.stringify(
            {
                // level: `${info.level.toUpperCase()}`,
                // message: `${info.message.toUpperCase()}`,
                // time: `${dateFormat()} `,
                // Function: `${route} `,
                // method: `${info.obj.req.method}`,
                // originalUrl: `${info.obj.req.originalUrl}`
                // data: `${JSON.stringify(info.obj.data)}`
            }
        ) : JSON.stringify(
            {
                // level: `${info.level.toUpperCase()}`,
                // message: `${info.message.toUpperCase()}`,
                // time: `${dateFormat()} `,
                // Function: `${route} `
            }
        );

        return message;
    });
};
module.exports = LoggerService;