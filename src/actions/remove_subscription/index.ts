require('dotenv').config()
import inquirer from 'inquirer'
import { find } from 'underscore'
import { log, green, yellow } from '../../utils/log'
import { getClient } from '../../mongo/client'

export default async () => {
  try {
    log('--------------------------------------------------------')
    log('[did-cli] subscription remove')
    log('--------------------------------------------------------')
    const { client, db } = await getClient()
    const collection = db.collection('subscriptions')
    const subscriptions = await collection.find({}).toArray()
    const input = await inquirer.prompt<any>(
      require('./_prompts.js')(subscriptions)
    )
    if (input.confirm) {
      const subscription = find(
        subscriptions,
        (s) => s._id === input.subscriptionId
      )
      await collection.deleteOne({ _id: subscription._id })
      if (input.dropDatabase) {
        await client.db(subscription.db).dropDatabase()
      }
      log('[did-cli]', green(`Subscription succesfully deleted.`))
    }
    await client.close()
  } catch (error) {
    log('[did-cli]', yellow.underline('Failed to delete subscription.'))
  }
  process.exit(0)
}
