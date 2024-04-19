import { cyan, printSeparator, yellow } from './utils/log'
import { getDbNameFromConnectionString } from './utils/getDbNameFromConnectionString'

require('dotenv').config()


export async function action(args: any) {
  if(!args.MONGO_DB_CONNECTION_STRING) {
    printSeparator('Mongo DB connection string is not provided', true, yellow)
    process.exit(0)
  }
  if(!args.MONGO_DB_DB_NAME) {
    printSeparator('Mongo DB database is not provided', true, yellow)
    process.exit(0)
  }
  const instance = getDbNameFromConnectionString(args.MONGO_DB_CONNECTION_STRING)
  printSeparator(`did-cli is initialized with ${instance}:${args.MONGO_DB_DB_NAME}`, true, cyan)
  process.exit(0)
}
