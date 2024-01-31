require('dotenv').config()
import got from 'got/dist/source'
import inquirer from 'inquirer'
import { getClient } from '../../mongo/client'
import { printSeparator, cyan, log, yellow, green } from '../../utils/log'
import questions from './questions'
import { WebAPIHolidaysData } from './types'
import { OptionalId } from 'mongodb'

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * 
 * @param dowOffset dowOffset
 * 
 * @return int
 */
function getWeekNumber(date: Date, dowOffset: number): number {
  var newYear = new Date(date.getFullYear(), 0, 1)
  var day = newYear.getDay() - dowOffset
  day = (day >= 0 ? day : day + 7)
  var daynum = Math.floor((date.getTime() - newYear.getTime() -
    (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1
  var weeknum: number, nYear: Date, nday: number
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1
    if (weeknum > 52) {
      nYear = new Date(date.getFullYear() + 1, 0, 1)
      nday = nYear.getDay() - dowOffset
      nday = nday >= 0 ? nday : nday + 7
      weeknum = nday < 4 ? 1 : 53
    }
  }
  else {
    weeknum = Math.floor((daynum + day - 1) / 7)
  }
  return weeknum
}

function getPeriodId(date: Date, dowOffset: number): string {
  return [
    getWeekNumber(date, dowOffset),
    date.getMonth() + 1,
    date.getFullYear()
  ].join('_')
}

function parseDateString(dateStr: string) {
  const [, y, m, d] = [...dateStr.matchAll(/([0-9]{4})-([0-9]{2})-([0-9]{2})/gm)][0]
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 12, 0, 0, 0)
}

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
  const docs = (JSON.parse(body).data as WebAPIHolidaysData).map<OptionalId<Document>>((item) => {
    const date = parseDateString(item.date)
    return {
      _id: item.date.replace(/[\W]/gm, ''),
      name: item.description,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      periodId: getPeriodId(date, 1),
      date
    } as any
  })
  await db.collection('holidays').insertMany(docs)
  printSeparator(`${docs.length} holidays for year ${year} succesfully created in db holidays.`, true, green)
  await client.close(true)
}
