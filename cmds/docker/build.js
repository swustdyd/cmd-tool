const debug = require('debug')('cmd-tool:docker:build');
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs-extra');
const { rootPath, toolConfigPath } = require('../../config');

exports.command = ['build', 'b'];
exports.desc = 'build docker镜像';

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
      describe: '项目名称, 默认当前目录',
      type: 'string',
    })
    .option('port', {
      alias: 'p',
      describe: '对外暴露的端口',
      type: 'number',
      demand: true,
    });
};

exports.handler = async (argv) => {
  const {
    type,
    name,
    port,
  } = argv;
  const cwdDir = process.cwd();
  const projectName = name || cwdDir.substr(cwdDir.lastIndexOf('/') + 1);
  debug(`projectName is '${projectName}'`);

  const tmpDirName = 'tempDir';
  const tmpDirPath = path.join(cwdDir, tmpDirName);

  // 生成dockerfile文件
  shelljs.exec(`dydcmd docker df -n ${projectName} -p ${port} -t ${type} -f`);

  // 创建临时文件夹
  if (fs.existsSync(tmpDirName)) {
    shelljs.rm('-rf', tmpDirName);
  }
  shelljs.mkdir('-p', `${tmpDirName}/cmd-tool`);
  shelljs.mkdir('-p', `${tmpDirName}/toolConfig`);

  // 复制工具以及其配置文件
  shelljs.exec(`git clone -o origin -b master https://github.com/swustdyd/cmd-tool.git ${tmpDirName}/cmd-tool`);
  shelljs.cp(toolConfigPath, `${tmpDirName}/toolConfig/index.js`);

  // 停止并移除同名容器
  const runningContainer = shelljs.echo(`$(docker ps |  grep "${projectName}"  | awk '{print $1}')`).stderr;
  const allContainer = shelljs.echo(`$(docker images |  grep "${projectName}"  | awk '{print $3}')`).stderr;
  debug('running container is', runningContainer);
  debug('all container is', allContainer);
  if (runningContainer) {
    shelljs.exec(`docker stop $(docker ps | grep "${projectName}" | awk '{print $1}')`);
  }

  if (allContainer) {
    shelljs.exec(`docker rm $(docker ps -a | grep "${projectName}" | awk '{print $1}')`);
  }

  // 移除同名镜像
  const allImages = shelljs.echo(`$(docker images |  grep "${projectName}"  | awk '{print $3}')`).stderr;
  debug('all images is', allImages);
  if (allImages) {
    shelljs.exec(`docker rmi $(docker images |  grep "${projectName}"  | awk '{print $3}')`);
  }

  // build 镜像
  shelljs.exec(`docker build -t ${projectName} .`);

  // shelljs.rm('-rf', tmpDirPath);
};
