require('dotenv').config()
import boxen from 'boxen'
import inquirer from 'inquirer'
import path from 'path'
import { omit } from 'underscore'
import { getClient } from './mongo/client'
import packageJson from './package.json'
import { jsonToEnv, writeFileAsync } from './utils'
import { green, log, printSeparator, yellow } from './utils/log'

function getDbNameFromConnectionString(connectionString: string) {
  return connectionString.split('@')[0].split('mongodb://')[1].split(':')[0]
}

export async function action(args: any) {
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
      default: 'mongodb://',
      when: !args.MONGO_DB_CONNECTION_STRING
    },
    {
      type: 'list',
      name: 'MONGO_DB_DB_NAME',
      message: 'Mongo DB database',
      default: 'main',
      choices: async ({ MONGO_DB_CONNECTION_STRING }) => {
        try {
          const { client } = await getClient(MONGO_DB_CONNECTION_STRING || args.MONGO_DB_CONNECTION_STRING)
          const { databases } = await client.db().admin().listDatabases()
          await client.close(true)
          return databases.map(db => db.name)
        } catch (error: any) {
          printSeparator(error.message, false, yellow)
          process.exit(0)
        }
      },
      when: !args.MONGO_DB_DB_NAME
    },
    {
      type: 'confirm',
      name: 'DID_INSTALLED_LOCALLY',
      message: 'Do you have did installed locally?',
      when: !args.DID_LOCAL_PATH
    },
    {
      type: 'file-tree-selection',
      name: 'DID_LOCAL_PATH',
      message: '...where is did installed?',
      when: ({ DID_INSTALLED_LOCALLY }) => DID_INSTALLED_LOCALLY && !args.DID_LOCAL_PATH,
      dirOnly: true,
    }
  ])
  await writeFileAsync(
    path.resolve(__dirname, '.env'),
    jsonToEnv(
      omit(
        {
          ...args,
          ...env,
          INIT: '1'
        },
        'DID_INSTALLED_LOCALLY'
      )
    )
  )
  const instanceName = getDbNameFromConnectionString(env.MONGO_DB_CONNECTION_STRING)
  printSeparator(`did-cli sucessfully initialized with database ${instanceName}:${env.MONGO_DB_DB_NAME}`, true, green)
  process.exit(0)
}
