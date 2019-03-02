#!/usr/bin/env node

'use strict';

const yargs = require('yargs');

let program = yargs
  .commandDir('../cmds')
  .demandCommand(1, '请至少提供一个命令!')
  .help('h');

program.argv;

/**
 *  ============
 *  因为command的handler是异步的，所以不要在program.argv后有任何逻辑
 *  ============
 */
