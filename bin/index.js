#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs-extra');
const { runtimeEnv, toolDataPath } = require('../config');

if (!fs.existsSync(toolDataPath)) {
  fs.mkdirp(toolDataPath);
}

const program = yargs
  .commandDir('../cmds')
  .demandCommand(1, '请至少提供一个命令!')
  .help('h')
  .option('env', {
    alias: 'e',
    describe: `运行时环境，同 process.env.${runtimeEnv}`,
    choices: ['local', 'staging', 'preview', 'production'],
    type: 'string',
    default: process.env[runtimeEnv],
  });

program.argv;

/**
 *  ============
 *  因为command的handler是异步的，所以不要在program.argv后有任何逻辑
 *  ============
 */
