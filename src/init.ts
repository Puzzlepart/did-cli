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
import { getClient } from './mongo/client'

export async function action() {
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
      type: 'list',
      name: 'MONGO_DB_DB_NAME',
      message: 'Mongo DB database',
      default: 'main',
      choices: async ({ MONGO_DB_CONNECTION_STRING }) => {
        const { client } = await getClient(MONGO_DB_CONNECTION_STRING)
        const { databases } = await client.db().executeDbAdminCommand({ listDatabases: 1 })
        return databases.map(db => db.name)
      }
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
  process.exit(0)
}
