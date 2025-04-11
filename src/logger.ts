import pino from 'pino';
import config from './config';

const logger = pino({
  level: config.logger.level,
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
      colorize: true,
    },
  },
});

export default logger;
