require('dotenv').config()
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const { omit } = require('underscore')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const boxen = require('boxen')
const { jsonToEnv } = require('./utils')
const log = console.log
const package = require('../package.json')

const init_ = async () => {
  log(
    boxen(`${package.name} v${package.version}`, {
      padding: 1,
      borderStyle: 'double'
    })
  )
  const env = await inquirer.prompt([
    {
      type: 'input',
      name: 'MONGO_DB_CONNECTION_STRING',
      message: 'Mongo DB connection string',
      default: 'mongodb://'
    },
    {
      type: 'input',
      name: 'MONGO_DB_DB_NAME',
      message: 'Mongo DB database',
      default: 'main'
    },
    {
      type: 'confirm',
      name: 'DID_INSTALLED_LOCALLY',
      message: 'Do you have did installed locally?'
    },
    {
      type: 'file-tree-selection',
      name: 'DID_LOCAL_PATH',
      message: '...where is it?',
      when: ({ DID_INSTALLED_LOCALLY }) => DID_INSTALLED_LOCALLY,
      dirOnly: true
    }
  ])
  await writeFile(
    path.resolve(__dirname, '.env'),
    jsonToEnv(
      omit(
        {
          ...env,
          INIT: '1'
        },
        'DID_INSTALLED_LOCALLY'
      )
    )
  )
}

module.exports = init_
