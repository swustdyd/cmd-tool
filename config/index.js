const path = require('path');
const os = require('os');
const BaseConfig = require('../../config/index');

const { serviceBase } = BaseConfig;
const runtimeEnv = 'DYD_RUNTIME_ENV';
const configPathEnv = 'DYD_CONFIG_PATH';
const baseTemplatesPath = path.resolve(__dirname, '../templates');

module.exports = {
  serviceBase,
  runtimeEnv,
  configPathEnv,
  configPath: process.env[configPathEnv],
  templatePath: {
    dockerfile: `${baseTemplatesPath}/dockerfile`,
  },
  userHomePath: os.homedir(),
  toolDataPath: `${os.homedir()}/.cmd-tool`,
};
