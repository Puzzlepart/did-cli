#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/' + '.env' })
import yargs from 'yargs'
import packageJson from './package.json'
import actionsMap from './actions.map.json'
import inquirer from 'inquirer'
import { log, cyan, yellow, red } from './utils/log'

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt(
  'file-tree-selection',
  require('inquirer-file-tree-selection-prompt')
)

const prefix = `${cyan('did')}`
const actions = packageJson.config.actions || {}

const usage = Object.keys(actions)
  .map((k) => {
    return `${prefix} ${yellow(k)}\n\t${actions[k]}`
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
  log('[did-cli]', red.bold(`Unknown action ${args._.join(' ')}.`))
}

export const ab = null
