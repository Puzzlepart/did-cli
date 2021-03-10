require('dotenv').config()
const inquirer = require('inquirer')
const _ = require('underscore')
const chalk = require('chalk')
const config = require('./_config.json')
const { getClient } = require('../mongo/client')
const log = console.log

const run = async () => {
    if (process.env.INIT !== '1') {
        log(chalk.yellow('You need to run did init.'))
        process.exit(0)
    }
    const {
        name,
        tenantId,
        forecasting,
        ownerId,
        ownerName
    } = await inquirer.prompt(require('./_prompts.json'))
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
        const coll = config.collections[i]
        await client.db(dbName).createCollection(coll.name)
        if (coll.indexes) {
            for (let j = 0; j < coll.indexes.length; j++) {
                await client.db(dbName).collection(coll.name).createIndex(coll.indexes[j])
            }
        }
        if (coll.documents) {
            await client.db(dbName).collection(coll.name).insertMany(coll.documents)
        }
    }
    const ownerSurname = _.last(ownerName.split(' '))
    const ownerGivenName = ownerName.replace(` ${ownerSurname}`, '')
    await client.db(dbName).collection('users').insertOne({
        "_id": ownerId,
        "displayName": ownerName,
        "givenName": ownerGivenName,
        "preferredLanguage": "nb-NO",
        "role": "Owner",
        "surname": ownerSurname
    })
    process.exit(0)
}

run()