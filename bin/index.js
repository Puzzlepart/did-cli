#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/' + '.env' })
const yargs = require('yargs')
const chalk = require('chalk')
const package = require('../package.json')
const log = console.log
const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt(
  'file-tree-selection',
  require('inquirer-file-tree-selection-prompt')
)

const prefix = `${chalk.cyan('did')}`
const actions = package.config.actions || {}

const usage = Object.keys(actions)
  .map((k) => {
    return `${prefix} ${chalk.yellow(k)}\n\t${actions[k]}`
  })
  .join('\n')

const args = yargs
  .usage(`Usage: ${prefix} <action_name>\n\nAvailable actions:\n\n${usage}`)
  .option('path', {
    alias: 'path',
    describe: 'Path to file',
    type: 'string',
    demandOption: false
  }).argv

const action = args._.join('.')

switch (action) {
  case 'init':
    require('./init')()
    break
  case 'open':
    require('./actions/open')()
    break
  case 'subscription.add':
    require('./actions/add_subscription')(args)
    break
  case 'customer.add':
    require('./actions/add_customer')(args)
    break
  case 'import.csv':
    require('./actions/import_csv')(args.path)
    break
  default: {
    log('[did-cli]', chalk.red.bold(`Unknown action ${_.join(' ')}.`))
  }
}
