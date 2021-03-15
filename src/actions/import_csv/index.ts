require('dotenv').config()
import csv from 'csvtojson'
import inquirer from 'inquirer'
import { omit } from 'underscore'
import _ from 'underscore.string'
import { getClient } from '../../mongo/client'
import { green, log, yellow, cyan, printSeparator } from '../../utils/log'
import * as mapFunctions from './mapFunctions'
import * as fieldMapPrompts from './fieldMapPrompts'
import initialPrompts from './_prompts.json'

export async function action(args: Record<string, string>) {
  let path = args.path
  if (!path) {
    const prompt = await inquirer.prompt({
      type: 'file-tree-selection' as any,
      name: 'path',
      message: 'Select a CSV file'
    })
    path = prompt.path
  }
  if (!_.endsWith(path, '.csv')) {
    log('[did-cli]', yellow.underline('The file needs to be a CSV file.'))
    process.exit(0)
  }
  if (process.env['INIT'] !== '1') {
    log('[did-cli]', yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    printSeparator('import csv', true, cyan)
    const json = await csv().fromFile(path)
    printSeparator(`${json.length} items found in CSV file`)
    const { collectionName, importCount } = await inquirer.prompt(
      initialPrompts
    )
    printSeparator('Property mappings')
    const count = importCount === 'all' ? json.length : parseInt(importCount)
    const fields = Object.keys(json[0]).filter((f) => f.indexOf('@type') === -1)
    let fieldMap = await inquirer.prompt<Record<string, string>>(fieldMapPrompts[collectionName](fields, args))
    fieldMap = { ...omit(args, 'path'), ...fieldMap }
    const { db, client } = await getClient()
    let data: Record<string, any> = {}
    switch (collectionName) {
      case 'confirmed_periods': {
        printSeparator(`Retrieving time entries from collection [time_entries]`)
        data.time_entries = await db.collection('time_entries').find({}).toArray()
        printSeparator(`${data.time_entries.length} time entries retrieved from [time_entries]`)
      }
    }
    const documents = json
      .splice(0, count)
      .map(mapFunctions[collectionName](fieldMap, data))
    printSeparator(`Importing ${documents.length} items to collection [${collectionName}]`)
    await db.collection(collectionName).insertMany(documents)
    printSeparator(`Succesfully imported ${documents.length} documents to collection [${collectionName}].`, true, green)
    await client.close(true)
  } catch (error) {
    printSeparator(`Failed to import from CSV: ${error.message}`, true, yellow)
  } finally {
    process.exit(0)
  }
}
