import chalk from 'chalk'
import packageJson from '../package.json'
const log = console.log

const yellow = chalk['yellow']
const green = chalk['green']
const blue = chalk['blue']
const cyan = chalk['cyan']
const red = chalk['red']
const white = chalk['white']

function printSeparator(text: string, includePrefix = false, color = white) {
    const prefix = includePrefix ? `[${packageJson.name}]` : ''
    log('----------------------------------------------------------------------------------------------')
    log(color(`   ${prefix} ${text}                                                               `))
    log('----------------------------------------------------------------------------------------------')
}

export { log, yellow, green, blue, cyan, red, printSeparator }
