require('dotenv').config()
const inquirer = require('inquirer')
const chalk = require('chalk')
const { getClient } = require('../mongo/client')
const csv = require("csvtojson/v2")
const log = console.log

const import_csv = async (path) => {
    if (!path) {
        log('[did-cli]', chalk.yellow.underline('You need to specify path to the CSV file using --path.'))
        process.exit(0)
    }
    if (process.env.INIT !== '1') {
        log('[did-cli]', chalk.yellow.underline('You need to run did init.'))
        process.exit(0)
    }
    try {
        const json = await csv().fromFile(path)
        const { collectionName, importCount } = await inquirer.prompt(require('./_prompts.json'))
        const count = importCount === 'all' ? json.length : parseInt(importCount)
        const fields = Object.keys(json[0]).filter(f => f.indexOf('@type') === -1)
        const fieldMap = await inquirer.prompt(require(`./prompts/${collectionName}`)(fields))
        const documents = (json.splice(0, count)).map(require(`./map/${collectionName}`)(fieldMap))
        const { db, client } = await getClient()
        await db.collection(collectionName).insertMany(documents)
        log('[did-cli]', chalk.green(`Succesfully imported ${documents.length} documents to collection ${collectionName}.`))
        await client.close(true)
    } catch (error) {
        log('[did-cli]', chalk.yellow.underline(`Failed to import from CSV: ${error.message}`))
    }
    process.exit(0)
}

module.exports = import_csv