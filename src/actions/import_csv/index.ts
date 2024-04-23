require('dotenv').config()
import csv from 'csvtojson'
import inquirer from 'inquirer'
import * as lodash from 'lodash'
import { OptionalId } from 'mongodb'
import { omit } from 'underscore'
import _ from 'underscore.string'
import { getClient } from '../../mongo/client'
import { cyan, green, log, printSeparator, red, yellow } from '../../utils/log'
import * as fieldMapPrompts from './fieldMapPrompts'
import * as mapFunctions from './mapFunctions'
import initialQs from './questions.json'
import fs from 'fs'
import { promisify } from 'util'
const writeFileAsync = promisify(fs.writeFile)

export async function action(args: Record<string, string>) {
  let path = args.path
  let delimiter = args.delimiter
  if (!path) {
    const prompt = await inquirer.prompt([
      {
        type: 'file-tree-selection' as any,
        name: 'path',
        message: 'Select a CSV file',
        onlyShowValid: true,
        validate: (input: string) => input.endsWith('.csv') ? true : 'The file needs to be a CSV file.',
      },
      {
        type: 'input',
        name: 'delimiter',
        message: 'Delimiter',
        default: ';'
      }
    ])
    path = prompt.path
    delimiter = prompt.delimiter
  }
  if (process.env['INIT'] !== '1') {
    log('[did-cli]', yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  if (!_.endsWith(path, '.csv')) {
    log('[did-cli]', yellow.underline('The file needs to be a CSV file.'))
    process.exit(0)
  }
  try {
    printSeparator('import csv', true, cyan)
    const json = await csv({ delimiter }).fromFile(path)
    printSeparator(`${json.length} items found in CSV file. We'll check for uniqueness, so don't worry about duplicates.`, true, green)
    let collectionName = args.collectionName
    let importCount = args.importCount ?? 'all'
    if (!args.collectionName) {
      const prompt = await inquirer.prompt(
        initialQs
      )
      collectionName = prompt.collectionName
      importCount = prompt.importCount
    }
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
        break
      case 'customers': {
        printSeparator(`Retrieving customers from collection [customers]`)
        data[collectionName] = await db.collection(collectionName).find({}).toArray()
        printSeparator(`${data.customers.length} customers retrieved from [customers]`)
      }
        break
      case 'projects': {
        printSeparator(`Retrieving projects from collection [projects]`)
        data[collectionName] = await db.collection(collectionName).find({}).toArray()
        printSeparator(`${data[collectionName].length} projects retrieved from [projects]`)
      }
        break
    }
    const documents = lodash.uniqBy(json
      .splice(0, count)
      .map<OptionalId<Document>>(mapFunctions[collectionName](fieldMap, data)), '_id')
      .filter(Boolean)
      .filter((d) => !lodash.some(data[collectionName], { _id: d._id }) || !!args.update)
    if (args.output) {
      const fileName = args.includeTimestamp ? `${collectionName}-${new Date().getTime().toString()}.json` : `${collectionName}.json`
      await writeFileAsync(fileName, JSON.stringify(documents, null, 2))
      printSeparator(`Succesfully saved ${documents.length} documents to ${fileName}. Have a look at the file before importing.`, true, cyan)
    }

    if (args.update) {
      const documentsUpdate = documents
        .filter((d) => !!d[args.update] && (lodash.isArray(d[args.update]) ? !lodash.isEmpty(d[args.update]) : true))
      printSeparator(`Updating ${documentsUpdate.length} items in collection [${collectionName}]`)
      for (const document of documentsUpdate) {
        const set = { ...lodash.pick(document, args.update), icon: 'MiniContract' } as Record<string, any>
        const { confirm } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirm',
          message: `Do you want to update the document with _id [${document._id}] with values ${JSON.stringify(set)}?`,
          default: true,
          when: () => !args.force
        })
        if (!confirm) continue
        await db.collection(collectionName).updateOne({ _id: document._id }, { $set: set })
      }
      printSeparator(`Succesfully updated ${documentsUpdate.length} documents in collection [${collectionName}].`, true, green)
    } else {
      const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Do you want to import ${documents.length} items to collection [${collectionName}]?`
      })
      if (!confirm) {
        await client.close(true)
        process.exit(0)
      }
      printSeparator(`Importing ${documents.length} items to collection [${collectionName}]`)
      await db.collection(collectionName).insertMany(documents)
      printSeparator(`Succesfully imported ${documents.length} documents to collection [${collectionName}].`, true, green)
    }
    await client.close(true)
  } catch (error) {
    printSeparator(`Failed to import from CSV: ${(error as any).message}`, true, red)
  } finally {
    process.exit(0)
  }
}
