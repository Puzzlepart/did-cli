require('dotenv').config()
const inquirer = require('inquirer')
const { getClient } = require('../mongo/client')

const run = async () => {
    const answers = await inquirer.prompt(require('./_prompts.json'))
    const { db } = await getClient()
    console.log(db.databaseName)
    process.exit(0)
}

run()