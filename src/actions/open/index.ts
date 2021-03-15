require('dotenv').config()
import { execAsync } from '../../utils'
import { log, yellow } from '../../utils/log'

export async function action() {
  if (!process.env.DID_LOCAL_PATH) {
    log('[did-cli]', yellow.underline("You don't have did installed locally."))
    process.exit(0)
  }
  await execAsync(`code ${process.env.DID_LOCAL_PATH}`)
  process.exit(0)
}
