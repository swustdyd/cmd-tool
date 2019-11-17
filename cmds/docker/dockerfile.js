const debug = require('debug')('cmd-tool:docker:dockerfile');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const mustache = require('mustache');
const { templatePath } = require('../../config');

const dockerfileTemplatePath = templatePath.dockerfile;
exports.command = ['dockerfile', 'df'];
exports.desc = '创建通用的dockerfile文件';

exports.builder = (yargs) => {
  yargs
    .option('type', {
      alias: 't',
      describe: '项目的类型，如egg, express, java等',
      choices: ['egg'],
      type: 'string',
      default: 'egg',
    })
    .option('name', {
      alias: 'n',
      describe: '项目名称',
      type: 'string',
      demand: true,
    })
    .option('port', {
      alias: 'p',
      describe: '对外暴露的端口',
      type: 'number',
      demand: true,
    })
    .option('destination', {
      alias: 'd',
      describe: 'dockerfile存放的目标路径(绝对路径)，默认为执行命令的当前文件夹下',
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
    type,
    name,
    port,
    destination,
    force,
  } = argv;
  const defaultDir = process.cwd();
  const finalPath = `${destination || defaultDir}/Dockerfile`;
  debug(argv);
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
  const dockerfileStr = mustache.render(
    fs.readFileSync(`${dockerfileTemplatePath}/${type}.mustache`, { encoding: 'utf-8' }),
    {
      name,
      port,
      env,
    },
  );
  debug(dockerfileStr);
  fs.writeFileSync(finalPath, dockerfileStr);
};
