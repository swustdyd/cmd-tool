const log4js = require('log4js');
const { toolDataPath } = require('../config');

log4js.configure({
  disableClustering: true,
  appenders: {
    error: {
      type: 'dateFile',
      filename: `${toolDataPath}/logs/error.log`,
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      backups: 5, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
    },
    console: {
      type: 'console',
    },
  },
  categories: {
    default: { appenders: ['console'], level: 'trace' },
    axios: { appenders: ['error'], level: 'error' },
    error: { appenders: ['error'], level: 'error' },
  },
});

module.exports = {
  /**
   * 获取logger
   * @param  {'default'|'axios'|'error'} category
   */
  getLogger: category => log4js.getLogger(category),
};
