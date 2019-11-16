const debug = require('debug')('pull-config');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { configPath } = require('../config');
const { serviceBase } = require('../lib/serviceBase');

exports.command = ['pull-config'];
exports.desc = '拉取对应环境的配置';

exports.builder = (yargs) => {
  yargs
    .option('key', {
      alias: 'k',
      describe: '配置的key，设置该值可以只拉取一部分配置',
      type: 'string',
    })
    .option('force', {
      alias: 'f',
      describe: '慎用，带上 -f 参数会直接覆盖源文件，不会进行询问',
      type: 'boolean',
    });
};

exports.handler = async (argv) => {
  const {
    env,
    key,
    force,
  } = argv;
  const finalPath = `${configPath}/index.${env}.json`;
  debug(argv);
  debug(configPath);
  debug(finalPath);

  const existDockerfile = fs.existsSync(finalPath);


  // 已存在文件，且没有说明要覆盖
  if (existDockerfile && !force) {
    const answer = await inquirer.prompt({
      type: 'confirm',
      name: 'isContinue',
      message: `文件‘${finalPath}’在本地已存在，是否继续(继续将覆盖该文件的内容)？`,
      default: false,
    });
    if (!answer.isContinue) {
      console.log(chalk.yellow('文件已存在，不覆盖该文件。'));
      return;
    }
  }

  const config = await serviceBase.getConfig({
    env,
    key,
  });
  debug(JSON.stringify(config, undefined, 2));
  fs.writeFileSync(finalPath, JSON.stringify(config, undefined, 2));
};
