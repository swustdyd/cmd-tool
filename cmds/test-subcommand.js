'use strict';

const debug = require('debug')('test-subcommand');
const shelljs = require('shelljs');
exports.command = [ 'test-subcommand' ];
exports.desc = '子命令实现示例';

exports.builder = yargs => {
  yargs
    .option('e', {
      alias: 'env',
      describe: '运行环境: unittest, local, staging, preview, production',
      type: 'string',
    });
};

exports.handler = async argv => {
  debug(argv);
};
