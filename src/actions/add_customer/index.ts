require('dotenv').config()
import inquirer from 'inquirer'
import _ from 'underscore'
import { log, yellow, green } from '../../utils/log'
import { getClient } from '../../mongo/client'

export default async (args) => {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    log('--------------------------------------------------------')
    log('[did-cli] customer add')
    log('--------------------------------------------------------')
    const input: { [key: string]: string } = await inquirer.prompt(
      require('./_prompts.js')(args)
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
    log('[did-cli]', green('Customer succesfully created.'))
    await client.close(true)
  } catch (error) {
    console.log(error)
    log('[did-cli]', yellow.underline('Failed to create customer.'))
  }
  process.exit(0)
}
