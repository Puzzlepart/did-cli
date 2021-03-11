require('dotenv').config()
import { exec } from 'child_process'
import chalk from 'chalk'
const log = console.log

export default async () => {
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
