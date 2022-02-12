import { pino } from 'pino';
const logger = pino({
  enabled: !!process.env.NOLOG,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  name: 'image2ascii',
  timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
});

export default logger;
