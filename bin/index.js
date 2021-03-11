#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/' + '.env' })
const yargs = require('yargs')
const chalk = require('chalk')
const package = require('../package.json')
const actionsMap = require('./actions.map.json')
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

if (actionsMap[action]) {
  require(actionsMap[action])(args)
} else {
  log('[did-cli]', chalk.red.bold(`Unknown action ${args._.join(' ')}.`))
}
