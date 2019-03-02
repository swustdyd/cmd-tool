const debug = require('debug')('check-dependencies');
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');

exports.command = ['check-dependencies'];
exports.desc = '检测package.json的dependencies是否更改，若更改，则重新安装';


/**
 * 安装 dependencies
 * @param {string} dir 安装路径
 */
function installDependencies(installPath) {
  debug(`installPath: ${installPath}`);
  if (fs.existsSync(path.join(installPath, 'node_modules'))) {
    debug(`remove node_modules ${path.join(installPath, 'node_modules')}`);
    shelljs.rm('rf', installPath);
  }
  shelljs.cd(installPath);
  shelljs.pwd();
  debug(`installPath: ${installPath}`);
  shelljs.exec('npm install --production', { async: true });
}

exports.builder = (yargs) => {
  yargs
    .option('d', {
      alias: 'dir',
      describe: '检查的目录地址(绝对路径)',
      type: 'string',
    });
};

exports.handler = async (argv) => {
  debug(argv);
  /**
   * @type {{dir: string}}}
   */
  const {
    dir = process.cwd(),
  } = argv;
  debug(`dir: ${dir}`);
  const finalPath = path.join(dir, 'package.json');
  if (!fs.existsSync(dir)) {
    // eslint-disable-next-line
    console.error(`'${finalPath}' not exist`);
  }

  const copyPathOfPackage = path.resolve(__dirname, `../copys/copy_${finalPath.replace(/\//g, '_')}`);
  debug(`copyPathOfPacage: ${copyPathOfPackage}`);

  if (fs.existsSync(copyPathOfPackage)) {
    // 检测是否更改
    const originData = JSON.parse(fs.readFileSync(finalPath));
    const copyData = JSON.parse(fs.readFileSync(copyPathOfPackage));
    const { dependencies: originDependencies } = originData;
    const { dependencies: copyDependencies } = copyData;
    if (JSON.stringify(originDependencies) === JSON.stringify(copyDependencies)) {
      // eslint-disable-next-line
      console.log('package.json no change');
    } else {
      shelljs.rm(copyPathOfPackage);
      shelljs.cp(finalPath, copyPathOfPackage);
      installDependencies(dir);
    }
  } else {
    shelljs.cp(finalPath, copyPathOfPackage);
    if (!fs.existsSync(path.join(dir, 'node_modules'))) {
      installDependencies(dir);
    }
  }
};
