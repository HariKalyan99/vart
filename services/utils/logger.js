const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, colorize, errors } = format;

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  }),
  errors({ stack: true })
);

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    // new DailyRotateFile({
    //   filename: 'logs/taskmanager-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD',
    //   zippedArchive: true,
    //   maxSize: '20m', 
    //   maxFiles: '10d',
    //   level: 'info',
    // }),
  ],
});

module.exports = logger;