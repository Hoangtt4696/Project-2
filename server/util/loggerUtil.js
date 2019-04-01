import path from 'path';
import bunyan from 'bunyan';
import RotatingFileStream from 'bunyan-rotating-file-stream';

import envConfig from '../../config/config';

const isDevMode = envConfig.NODE_ENV === 'development';

const logger = bunyan.createLogger({
  name: envConfig.log.name,
  src: true,
  streams: [
    {
      level: 'error',
      stream: process.stdout,
    },
  ].concat(isDevMode ? [
    {
      type: 'raw',
      level: 'info',
      stream: new RotatingFileStream({
        path: `${path.join(envConfig.log.path, envConfig.log.name)}.info.log`,
        period: '1d',          // daily rotation
        totalFiles: 7,         // keep up to 10 back copies
        rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
        threshold: '5m',       // Rotate log files larger than 10 megabytes
        totalSize: '10m',      // Don't keep more than 20mb of archived log files
        gzip: true,
        fieldOrder: ['time', 'level', 'msg', 'errors', 'src'],
      }),
    },
    {
      type: 'raw',
      level: 'warn',
      stream: new RotatingFileStream({
        path: `${path.join(envConfig.log.path, envConfig.log.name)}.warn.log`,
        period: '1d',
        totalFiles: 7,
        rotateExisting: true,
        threshold: '5m',
        totalSize: '10m',
        gzip: true,
        fieldOrder: ['time', 'level', 'msg', 'errors', 'src'],
      }),
    },
    {
      type: 'raw',
      level: 'error',
      stream: new RotatingFileStream({
        path: `${path.join(envConfig.log.path, envConfig.log.name)}.error.log`,
        period: '1d',
        totalFiles: 7,
        rotateExisting: true,
        threshold: '10m',
        totalSize: '20m',
        gzip: true,
        fieldOrder: ['time', 'level', 'msg', 'errors', 'src'],
      }),
    },
  ] : [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'warn',
      stream: process.stdout,
    },
  ]),
});

export default logger;
