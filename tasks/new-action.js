const inquirer = require('inquirer')
const log = console.log
const util = require('util')
const fs = require('fs')
const path = require('path')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

function replaceTokens(
    str,
    values,
    regex = /\{{(.+?)\}}/gm
)  {
    return str.replace(regex, (_m, $1) => values[$1])
}

async function new_action() {
    log('--------------------------------------------------------')
    log('[did-cli] New action')
    log('--------------------------------------------------------')
    const action = await inquirer.prompt([
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
    const index = (await readFile(path.resolve(basePath, '.template/index.txt'))).toString()

    await mkdir(path.resolve(basePath, action.key))
    await writeFile(path.resolve(basePath, `${action.key}/README.md`), replaceTokens(readme, action))
    await writeFile(path.resolve(basePath, `${action.key}/index.js`), replaceTokens(index, action))
    process.exit(0)
}

new_action()