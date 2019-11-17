const debug = require('debug')('cmd-tool:config');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chalk = require('chalk');

const toolDataPath = `${os.homedir()}/.cmd-tool`;
const toolConfigDirPath = `${toolDataPath}/config`;
const toolConfigPath = `${toolConfigDirPath}/index.js`;

if (!fs.existsSync(toolConfigDirPath)) {
  fs.mkdirp(toolConfigDirPath);
}
if (!fs.existsSync(toolConfigPath)) {
  console.log(chalk.red(`目录 '${toolConfigDirPath}' 下， 缺少该工具的配置文件, 请添加`));
  console.log(chalk.yellow('// index.js'));
  console.log(chalk.yellow(`
  module.exports =  {
    serviceBase: {
      host: 'your host',
      port: 'your port',
      user: 'your username',
      pwd: 'your password'
    }
  };
  `));
  process.exit(1);
}
const ToolConfig = require(toolConfigPath);
debug(ToolConfig);

const { serviceBase } = ToolConfig;
const runtimeEnv = 'DYD_RUNTIME_ENV';
const configPathEnv = 'DYD_CONFIG_PATH';
const baseTemplatesPath = path.resolve(__dirname, '../templates');

module.exports = {
  rootPath: path.resolve(__dirname, '../'),
  serviceBase,
  runtimeEnv,
  configPathEnv,
  configPath: process.env[configPathEnv],
  templatePath: {
    dockerfile: `${baseTemplatesPath}/dockerfile`,
  },
  userHomePath: os.homedir(),
  toolDataPath,
  toolConfigPath,
};
