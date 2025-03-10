import chalk from 'chalk'
import packageJson from '../package.json'
const log = console.log

const yellow = chalk['yellow']
const green = chalk['green']
const blue = chalk['blue']
const cyan = chalk['cyan']
const red = chalk['red']
const white = chalk['white']
const whiteOnBlack = chalk.whiteBright.bgBlack

/**
 * Print separator using console.log
 * 
 * @param text - Text
 * @param includePrefix - Include prefix
 * @param color - Color
 */
function printSeparator(text: string, includePrefix = false, color = white) {
    const prefix = includePrefix ? `[${packageJson.name}] ` : ''
    log('----------------------------------------------------------------------------------------------')
    log(color(`   ${prefix}${text}                                                               `))
    log('----------------------------------------------------------------------------------------------')
}

/**
 * 
 * @param text - Text
 * @param color - Color
 */
 function print(text: string, color = white) {
    log(color(`${text}`))
}

export { log, yellow, green, blue, cyan, red, whiteOnBlack, printSeparator, print }
