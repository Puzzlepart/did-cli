require('dotenv').config()
import inquirer from 'inquirer'
import { getClient } from '../../mongo/client'
import { cyan, green, log, printSeparator, yellow } from '../../utils/log'
import questions from './questions'

/**
 * Removes special characters and capitalizes the key
 * 
 * @param key - Key
 * @param maxLen - Max length
 * 
 * @returns Valid key
 */
function createValidKey(key: string, maxLen = 12) {
  return key.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, maxLen)
}

/**
 * project add
 * 
 * @description Adds a new project to Did. You will be prompted for all neccessary information.
 * 
 * @param args - Args
 */
export async function action(args) {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    printSeparator('project add', true, cyan)
    const { client, db } = await getClient()
    const customers = await db.collection('customers').find({}).toArray()
    const input: Record<string, string> = await inquirer.prompt(
      questions(args, customers)
    )
    const {
      customerKey,
      key,
      name,
      description,
      icon
    } = { ...args, ...input } as any
    const customerKey_ = createValidKey(customerKey)
    const key_ = createValidKey(key)
    const _id = [customerKey_, key_].join(' ')
    await db.collection('projects').insertOne({
      _id,
      key: key_,
      tag: _id,
      customerKey: customerKey_,
      name,
      description,
      icon,
      webLink: null,
      externalSystemURL: null,
      inactive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    printSeparator(`Project ${_id} succesfully created`, true, green)
    await client.close(true)
  } catch (error) {
    printSeparator(`Failed to create project: ${error.message}`, true, yellow)
  } finally {
    process.exit(0)
  }
}
