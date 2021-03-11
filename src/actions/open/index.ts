require('dotenv').config()
import { exec } from 'child_process'
import { log, yellow } from '../../utils/log'

export default async () => {
  if (!process.env.DID_LOCAL_PATH) {
    log('[did-cli]', yellow.underline("You don't have did installed locally."))
    process.exit(0)
  }
  exec(`code ${process.env.DID_LOCAL_PATH}`, () => {
    //
  })
}
