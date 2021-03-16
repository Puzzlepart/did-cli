#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/' + '.env' })
import inquirer from 'inquirer'
import { omit } from 'underscore'
import yargs from 'yargs'
import actionsMap from './actions.map.json'
import packageJson from './package.json'
import { cyan, printSeparator, yellow } from './utils/log'

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
  .options('about', {
    type: 'boolean',
    description: 'Show about'
  })
  .option('path', {
    alias: 'path',
    describe: 'Path to file',
    type: 'string',
    demandOption: false
  }).argv

const action = args._.join('.')

if (args.about) {
  require('./about').option()
} else if (actionsMap[action]) {
  require(actionsMap[action]).action(omit(args, '$0', '_'))
} else {
  printSeparator(`Unknown action. Did you mean to run ${cyan('did init')}?`, true, yellow)
}
