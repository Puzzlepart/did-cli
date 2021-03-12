require('dotenv').config()
import csv from 'csvtojson'
import inquirer from 'inquirer'
import _ from 'underscore.string'
import { getClient } from '../../mongo/client'
import { green, log, yellow } from '../../utils/log'
import * as mapFunc from './map'
import * as prompts from './prompts'
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
    log('--------------------------------------------------------')
    log('[did-cli] import csv')
    log('--------------------------------------------------------')
    const json = await csv().fromFile(path)
    const { collectionName, importCount } = await inquirer.prompt(
      initialPrompts
    )
    log('--------------------------------------------------------')
    log('                   Property mappings                    ')
    log('--------------------------------------------------------')
    const count = importCount === 'all' ? json.length : parseInt(importCount)
    const fields = Object.keys(json[0]).filter((f) => f.indexOf('@type') === -1)
    let fieldMap = await inquirer.prompt<Record<string, string>>(prompts[collectionName](fields, args))
    fieldMap = { ...args, ...fieldMap }
    const documents = json
      .splice(0, count)
      .map(mapFunc[collectionName](fieldMap))
    const { db, client } = await getClient()
    await db.collection(collectionName).insertMany(documents)
    log(
      '[did-cli]',
      green(
        `Succesfully imported ${documents.length} documents to collection ${collectionName}.`
      )
    )
    await client.close(true)
  } catch (error) {
    log(
      '[did-cli]',
      yellow.underline(`Failed to import from CSV: ${error.message}`)
    )
  }
  process.exit(0)
}
