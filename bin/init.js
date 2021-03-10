require('dotenv').config()
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const boxen = require('boxen')
const log = console.log
const package = require('../package.json')

const run = async () => {
    log(boxen(package.name, { padding: 1, borderStyle: 'double' }))
    const { connectionString, dbName } = await inquirer.prompt([
        {
            'type': 'input',
            'name': 'connectionString',
            'message': 'Mongo DB connection string',
            'default': ''
        },
        {
            'type': 'input',
            'name': 'dbName',
            'message': 'Mongo DB database',
            'default': ''
        }
    ])
    await writeFile(path.resolve(__dirname, '.env'), `INIT=1\nMONGO_DB_CONNECTION_STRING=${connectionString}\nMONGO_DB_DB_NAME=${dbName}`)
}

run()