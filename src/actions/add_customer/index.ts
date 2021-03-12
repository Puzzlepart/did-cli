require('dotenv').config()
import inquirer from 'inquirer'
import { getClient } from '../../mongo/client'
import { cyan, green, log, printSeparator, yellow } from '../../utils/log'
import prompts from './_prompts'

export async function action(args) {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    printSeparator('customer add', true, cyan)
    const input: { [key: string]: string } = await inquirer.prompt(
      prompts(args)
    )
    const { key, name, description, icon } = { ...args, ...input } as any
    const { client, db } = await getClient()
    await db.collection('customers').insertOne({
      _id: key,
      key,
      description,
      icon,
      inactive: false,
      name,
      webLink: null,
      externalSystemURL: null
    })
    printSeparator('Customer succesfully created', true, green)
    await client.close(true)
  } catch (error) {
    printSeparator(`Failed to create customer: ${error.message}`, true, yellow)
  }
  process.exit(0)
}
