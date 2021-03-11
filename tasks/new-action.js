const inquirer = require('inquirer')
const log = console.log
const util = require('util')
const fs = require('fs')
const path = require('path')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const package = require('../package.json')
const actionsMap = require('../bin/actions.map.json')
const child_process = require('child_process')
const exec = util.promisify(child_process.exec)

const BASE_PATH = path.resolve(__dirname, '../src/actions')
const ROOT_PATH = path.resolve(__dirname, '../')

function replaceTokens(
    str,
    values,
    regex = /\{{(.+?)\}}/gm
) {
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
        },
        {
            type: 'confirm',
            name: 'createBranch',
            message: 'Check out new branch?',
            default: true
        }
    ])
    if (action.createBranch) {
        await exec(`git checkout -b new-action/${action.key}`)
    }
    const [readmeTmpl, indexTmpl, actionsReadme] = await Promise.all([
        readFile(path.resolve(BASE_PATH, '.template/README.md')),
        readFile(path.resolve(BASE_PATH, '.template/index.txt')),
        readFile(path.resolve(ROOT_PATH, 'readme/3-actions.md'))
    ])
    package.config.actions = {
        ...package.config.actions,
        [action.name]: action.description
    }
    let actionsMap_ = {
        ...actionsMap,
        [action.name.split(' ').join('.')]: `./actions/${action.key}`
    }
    let actionsReadme_ = actionsReadme.toString() + `\n\n[[ load:bin/actions/${action.key}/README.md ]]`
    await mkdir(path.resolve(BASE_PATH, action.key))
    await Promise.all([
        writeFile(path.resolve(BASE_PATH, `${action.key}/README.md`), replaceTokens(readmeTmpl.toString(), action)),
        writeFile(path.resolve(BASE_PATH, `${action.key}/index.js`), replaceTokens(indexTmpl.toString(), action)),
        writeFile(path.resolve(ROOT_PATH, `package.json`), JSON.stringify(package, null, 2)),
        writeFile(path.resolve(ROOT_PATH, `src/actions.map.json`), JSON.stringify(actionsMap_, null, 2)),
        writeFile(path.resolve(ROOT_PATH, 'readme/3-actions.md'), actionsReadme_)
    ])
    process.exit(0)
}

new_action()