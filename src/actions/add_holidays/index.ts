require('dotenv').config()
import got from 'got/dist/source'
import inquirer from 'inquirer'
import { getClient } from '../../mongo/client'
import { printSeparator, cyan, log, yellow, green } from '../../utils/log'
import questions from './questions'
import { WebAPIHolidaysData } from './types'

/**
 * Add holidays
 * 
 * @description Add holidays to storage from `https://webapi.no/api/v1/holidays/{year}`
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
  const [holidaysCollection] = await db.listCollections({ name: 'holidays' }).toArray()
  if (!holidaysCollection) {
    printSeparator(`Holidays collection not found. Are you connected to the correct database?`, true, yellow)
    process.exit(0)
  }
  const input = await inquirer.prompt(questions(args))
  let { year } = { ...args, ...input } as any
  const { body } = await got(`https://webapi.no/api/v1/holidays/${year}`)
  const docs = (JSON.parse(body).data as WebAPIHolidaysData).map((item) => ({
    _id: item.date.replace(/[\W]/gm, ''),
    name: item.description,
    date: new Date(item.date)
  }))
  await db.collection('holidays').insertMany(docs)
  printSeparator(`${docs.length} holidays for year ${year} succesfully created in db holidays.`, true, green)
  await client.close(true)
}
