require('dotenv').config()
const inquirer = require('inquirer')

const run = async () => {
    const answers = await inquirer.prompt(require('./_prompts.json'))
    console.log({ answers, env: process.env })
}

run()