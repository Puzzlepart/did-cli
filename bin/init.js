require('dotenv').config()
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const boxen = require('boxen')
const log = console.log
const package = require('../package.json')

const init_ = async () => {
  log(
    boxen(`${package.name} v${package.version}`, {
      padding: 1,
      borderStyle: 'double'
    })
  )
  const { connectionString, dbName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'connectionString',
      message: 'Mongo DB connection string',
      default: 'mongodb://'
    },
    {
      type: 'input',
      name: 'dbName',
      message: 'Mongo DB database',
      default: 'main'
    },
    {
      type: 'confirm',
      name: 'installedLocally',
      message: 'Do you have did installed locally?'
    },
    {
      type: 'file-tree-selection',
      type: 'file',
      name: 'installedPath',
      message: '...where is it?',
      dirOnly: true
    }
  ])
  await writeFile(
    path.resolve(__dirname, '.env'),
    `INIT=1\nMONGO_DB_CONNECTION_STRING=${connectionString}\nMONGO_DB_DB_NAME=${dbName}`
  )
}

module.exports = init_
