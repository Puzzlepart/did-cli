require('dotenv').config()
import inquirer from 'inquirer'
import _ from 'underscore'
import { getClient } from '../../mongo/client'
import { green, log, yellow } from '../../utils/log'
import config from './_config.json'
import questions from './questions'

export async function action(args) {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    log('--------------------------------------------------------')
    log('[did-cli] subscription add')
    log('--------------------------------------------------------')
    const input = await inquirer.prompt(questions(args))
    const { client, db } = await getClient()
    const { name, tenantId, forecasting, owner } = { ...args, ...input } as any
    const dbName = _.last(tenantId.split('-'))
    const sub = {
      _id: tenantId,
      name,
      db: dbName,
      owner,
      settings: {
        forecast: {
          enabled: forecasting
        }
      }
    }
    await db.collection('subscriptions').insertOne(sub)
    for (let i = 0; i < config.collections.length; i++) {
      const coll = config.collections[i] as any
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
    log(
      '[did-cli]',
      green(`Subscription succesfully created with db ${dbName}.`)
    )
    await client.close(true)
  } catch (error) {
    console.log(error)
    log('[did-cli]', yellow.underline('Failed to create subscription.'))
  }
  process.exit(0)
}
