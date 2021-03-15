require('dotenv').config()
import inquirer from 'inquirer'
import _ from 'underscore'
import { getClient } from '../../mongo/client'
import { cyan, green, log, printSeparator, yellow } from '../../utils/log'
import questions from './questions'
import subscription_setup_config from './subscription_setup_config.json'

export async function action(args) {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    printSeparator('subscription add', true, cyan)
    const { client, db } = await getClient()
    const [subscriptions] = await db.listCollections({ name: 'subscriptions' }).toArray()
    if (!subscriptions) {
      printSeparator(`Subscriptions collection not found. Are you connected to the correct database?`, true, yellow)
      process.exit(0)
    }
    const input = await inquirer.prompt(questions(args))
    const { name, tenantId, forecasting, owner } = { ...args, ...input } as any
    const dbName = _.last(tenantId.split('-'))
    const sub = {
      _id: tenantId,
      name,
      db: dbName,
      owner,
      settings: {
        forecast: {
          enabled: forecasting,
          notifications: 4
        },
        adsync: {
          enabled: true,
          properties: [
            "displayName",
            "preferredLanguage",
            "mobilePhone",
            "surname",
            "givenName"
          ]
        }
      },
    }
    await db.collection('subscriptions').insertOne(sub)
    for (let i = 0; i < subscription_setup_config.collections.length; i++) {
      const coll = subscription_setup_config.collections[i] as any
      await client.db(dbName).createCollection(coll.name)
      if (coll.indexes) {
        for (let j = 0; j < coll.indexes.length; j++) {
          await client
            .db(dbName)
            .collection(coll.name)
            .createIndex(coll.indexes[j])
        }
      }
      if (coll.documents) {
        await client.db(dbName).collection(coll.name).insertMany(coll.documents)
      }
    }
    printSeparator(`Subscription succesfully created with db ${dbName}.`, true, green)
    await client.close(true)
  } catch (error) {
    printSeparator(`Failed to create subscription.: ${error.message}`, true, yellow)
  }
  process.exit(0)
}
