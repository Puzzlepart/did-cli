require('dotenv').config()
import inquirer from 'inquirer'
import { find, isEmpty } from 'underscore'
import { getClient } from '../../mongo/client'
import { cyan, green, printSeparator, yellow } from '../../utils/log'
import questions from './questions'

export async function action() {
  try {
    printSeparator('subscription remove', true, cyan)
    const { client, db } = await getClient()
    const collection = db.collection('subscriptions')
    const subscriptions = await collection.find({}).toArray()
    if (isEmpty(subscriptions)) {
      printSeparator(`No subscriptions found. Are you connected to the correct database?`, true, yellow)
      process.exit(0)
    }
    const input = await inquirer.prompt<any>(questions(subscriptions))
    if (input.confirm) {
      const subscription = find(
        subscriptions,
        (s) => s._id === input.subscriptionId
      )
      await collection.deleteOne({ _id: subscription._id })
      if (input.dropDatabase) {
        await client.db(subscription.db).dropDatabase()
      }
      printSeparator('Subscription succesfully deleted.', true, green)
    }
    await client.close()
  } catch (error) {
    printSeparator(`Failed to delete subscription: ${error.message}`, true, yellow)
  } finally {
    process.exit(0)
  }
}
