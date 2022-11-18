require('dotenv').config()
import inquirer from 'inquirer'
import { getClient } from '../../mongo/client'
import { printSeparator, cyan, log, yellow } from '../../utils/log'
import questions from './questions'

/**
 * Add holidays to storage from `https://webapi.no/api/v1/holidays/{year}}`
 * 
 * @description Add holidays to storage
 * 
 * @remarks A CLI action file must return a function named action
 * 
 * @param args - Args
 */
export async function action(args: any) {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  printSeparator('holidays add', true, cyan)
  const { client, db } = await getClient()
  const [holidays] = await db.listCollections({ name: 'holidays' }).toArray()
  if (!holidays) {
    printSeparator(`Holidays collection not found. Are you connected to the correct database?`, true, yellow)
    process.exit(0)
  }
  const input = await inquirer.prompt(questions(args))
  let { year } = { ...args, ...input } as any
  console.log(year)
}
