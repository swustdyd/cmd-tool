const debug = require('debug')('dockerfile');

exports.command = ['dockerfile', 'd'];
exports.desc = 'dockerfile相关的管理工具';

exports.builder = (yargs) => {
  yargs
    .commandDir('dockerfile')
    .demandCommand(1, 'dockerfile: 请至少提供一个命令!')
    .help('h');
};
