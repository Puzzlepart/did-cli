require('dotenv').config()
const inquirer = require('inquirer')
const { find } = require('underscore')
const chalk = require('chalk')
const log = console.log
const { getClient } = require('../../mongo/client')

const remove_subscription = async () => {
  log('--------------------------------------------------------')
  log('[did-cli] subscription remove')
  log('--------------------------------------------------------')
  try {
    const { client, db } = await getClient()
    const collection = db.collection('subscriptions')
    const subscriptions = await collection.find({}).toArray()
    const input = await inquirer.prompt(require('./_prompts.js')(subscriptions))
    if (input.confirm) {
      const subscription = find(
        subscriptions,
        (s) => s._id === input.subscriptionId
      )
      await collection.deleteOne({ _id: subscription._id })
      if (input.dropDatabase) {
        await client.db(subscription.db).dropDatabase()
      }
      log('[did-cli]', chalk.green(`Subscription succesfully deleted.`))
    }
    await client.close()
  } catch (error) {
    log('[did-cli]', chalk.yellow.underline('Failed to delete subscription.'))
  }
  process.exit(0)
}

module.exports = remove_subscription
