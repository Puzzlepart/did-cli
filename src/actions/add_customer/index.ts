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
function createValidKey(key: string, maxLen = 12): any {
  return key.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, maxLen)
}

export async function action(args: Record<string, string>) {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    printSeparator('customer add', true, cyan)
    const input: { [key: string]: string } = await inquirer.prompt(
      questions(args)
    )
    const { client, db } = await getClient()
    const { key, name, description, icon } = { ...args, ...input } as any
    const key_ = createValidKey(key)
    await db.collection('customers').insertOne({
      _id: key_,
      key: key_,
      description,
      icon,
      name,
      webLink: null,
      externalSystemURL: null,
      inactive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    printSeparator('Customer succesfully created', true, green)
    await client.close(true)
  } catch (error) {
    printSeparator(`Failed to create customer: ${(error as any).message}`, true, yellow)
  } finally {
    process.exit(0)
  }
}
