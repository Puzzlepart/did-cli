#!/usr/bin/env node
require('dotenv').config({ path: __dirname + "/" + '.env' })
const yargs = require('yargs')
const chalk = require('chalk')
const log = console.log

const options = yargs
    .usage('Usage: -action <action_name>')
    .option('action', { alias: 'action', describe: 'Action to execute', type: 'string', demandOption: false })
    .option('path', { alias: 'path', describe: 'Path to file', type: 'string', demandOption: false })
    .argv

if (options._[0] === 'init') {
    require('./init')
} else {
    switch (options.action) {
        case 'add_subscription': require('./add_subscription')
            break
        case 'import_csv': require('./import_csv')(options.path)
            break
        default: log(chalk.red.bold(`Unknown action ${options.action}.`))
    }
}