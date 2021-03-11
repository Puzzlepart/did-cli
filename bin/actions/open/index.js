require('dotenv').config()
const { exec } = require('child_process')
const chalk = require('chalk')
const log = console.log

const open = async () => {
  if (!process.env.DID_LOCAL_PATH) {
    log(
      '[did-cli]',
      chalk.yellow.underline("You don't have did installed locally.")
    )
    process.exit(0)
  }
  exec(`code ${process.env.DID_LOCAL_PATH}`, () => {
    //
  })
}

module.exports = open
