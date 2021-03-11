require('dotenv').config()
const inquirer = require('inquirer')
const _ = require('underscore')
const chalk = require('chalk')
const { getClient } = require('../../mongo/client')
const log = console.log

const add_customer = async (args) => {
  if (process.env.INIT !== '1') {
    log(chalk.yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    log('--------------------------------------------------------')
    log('[did-cli] customer add')
    log('--------------------------------------------------------')
    const input = await inquirer.prompt(require('./_prompts.js')(args))
    const { key, name, description, icon } = { ...args, ...input }
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
    log('[did-cli]', chalk.green('Customer succesfully created.'))
    await client.close(true)
  } catch (error) {
    console.log(error)
    log('[did-cli]', chalk.yellow.underline('Failed to create customer.'))
  }
  process.exit(0)
}

module.exports = add_customer
