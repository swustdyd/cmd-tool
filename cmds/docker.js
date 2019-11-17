const debug = require('debug')('cmd-tool:docker');

exports.command = ['docker', 'd'];
exports.desc = 'docker部分命令的封装';

exports.builder = (yargs) => {
  yargs
    .commandDir('docker')
    .demandCommand(1, 'docker: 请至少提供一个命令!')
    .help('h');
};
