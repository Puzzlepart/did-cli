require('dotenv').config()
import inquirer from 'inquirer'
import _ from 'underscore'
import { getClient } from '../../mongo/client'
import { green, log, yellow } from '../../utils/log'
import config from './_config.json'
import prompts from './_prompts.json'

export async function action() {
  if (process.env['INIT'] !== '1') {
    log(yellow.underline('You need to run did init.'))
    process.exit(0)
  }
  try {
    log('--------------------------------------------------------')
    log('[did-cli] subscription add')
    log('--------------------------------------------------------')
    const { name, tenantId, forecasting, owner } = await inquirer.prompt(
      prompts
    )
    const { client, db } = await getClient()
    const dbName = _.last(tenantId.split('-'))
    const sub = {
      _id: tenantId,
      name,
      db: dbName,
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
    await client
      .db(dbName)
      .collection('users')
      .insertOne({
        ...owner,
        displayName: `${owner.givenName} ${owner.surname}`,
        role: 'Owner'
      })
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
