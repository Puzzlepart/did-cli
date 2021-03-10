#!/usr/bin/env node
require('dotenv').config({ path: __dirname + "/" + '.env' })
const yargs = require('yargs')
const chalk = require('chalk')
const package = require('../package.json')
const log = console.log

const prefix = `${chalk.cyan('did')}${chalk.green(' --action')}`

const usage = Object.keys(package.config.actions).map(action => {
    return `${prefix} ${chalk.yellow(action)}\n\t${package.config.actions[action]}`
}).join('\n')

const options = yargs
    .usage(`Usage: ${prefix} <action_name>\n\nAvailable actions:\n\n${usage}`)
    .option('action', { alias: 'action', describe: 'Action to execute', type: 'string', demandOption: false })
    .option('path', { alias: 'path', describe: 'Path to file', type: 'string', demandOption: false })
    .argv

if (options._[0] === 'init' || !options.action) {
    require('./init')
} else {
    switch (options.action) {
        case 'add_subscription': require('./add_subscription')
            break
        case 'import_csv': require('./import_csv')(options.path)
            break
        default: {
            log('[did-cli]', chalk.red.bold(`Unknown action ${options.action}.`))
        }
    }
}