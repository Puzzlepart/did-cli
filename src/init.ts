require('dotenv').config()
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import { omit } from 'underscore'
import { promisify } from 'util'
const writeFile = promisify(fs.writeFile)
import boxen from 'boxen'
import { jsonToEnv } from './utils'
const log = console.log
import packageJson from './package.json'

const init_ = async () => {
  log(
    boxen(`${packageJson.name} v${packageJson.version}`, {
      padding: 1,
      borderStyle: 'double' as any
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
