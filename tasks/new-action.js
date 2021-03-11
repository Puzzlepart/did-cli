const inquirer = require('inquirer')
const log = console.log
const util = require('util')
const fs = require('fs')
const path = require('path')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

async function new_action() {
    log('--------------------------------------------------------')
    log('[did-cli] New action')
    log('--------------------------------------------------------')
    const { key, name, description } = await inquirer.prompt([
        {
            type: 'input',
            name: 'key',
            message: 'Action key'
        },
        {
            type: 'input',
            name: 'name',
            message: 'Action name'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Action description'
        }
    ])
    const basePath = path.resolve(__dirname, '../bin/actions')
    const readme = (await readFile(path.resolve(basePath, '.template/README.md'))).toString()
    const index = (await readFile(path.resolve(basePath, '.template/index.js'))).toString()

    await mkdir(path.resolve(basePath, key))
    await writeFile(path.resolve(basePath, `${key}/README.md`), readme)
    console.log(a)
    process.exit(0)
}

new_action()