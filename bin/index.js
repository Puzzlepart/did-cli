#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/' + '.env' })
const yargs = require('yargs')
const chalk = require('chalk')
const package = require('../package.json')
const log = console.log

const prefix = `${chalk.cyan('did')}${chalk.green(' --action')}`
const actions = package.config.actions || {}

const usage = Object.keys(actions)
  .map((k) => {
    return `${prefix} ${chalk.yellow(k)}\n\t${actions[k]}`
  })
  .join('\n')

const { _, action, path } = yargs
  .usage(`Usage: ${prefix} <action_name>\n\nAvailable actions:\n\n${usage}`)
  .option('action', {
    alias: 'action',
    describe: 'Action to execute',
    type: 'string',
    demandOption: false
  })
  .option('path', {
    alias: 'path',
    describe: 'Path to file',
    type: 'string',
    demandOption: false
  }).argv

if (_[0] === 'init' || !action) {
  require('./init')
} else {
  switch (action) {
    case 'add_subscription':
      require('./actions/add_subscription')
      break
    case 'import_csv':
      require('./actions/import_csv')(path)
      break
    default: {
      log('[did-cli]', chalk.red.bold(`Unknown action ${action}.`))
    }
  }
}
