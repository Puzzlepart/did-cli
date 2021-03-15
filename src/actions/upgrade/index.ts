require('dotenv').config()
import { exec } from 'child_process'
import packageJson from '../../package.json'
import { cyan, green, printSeparator, yellow } from '../../utils/log'

/**
 * Upgrade
 * 
 * @description Upgrade did-cli
 */
export async function action({ branch }) {
  printSeparator('Upgrading did-cli', true, cyan)
  let url = packageJson?.repository?.url
  if (branch) {
    url += `#${branch}`
  }

  printSeparator(`Upgrading did-cli from ${url}`)

  exec(`npm i -g "${url}"`, (error) => {
    if (error) {
      printSeparator(`Failed to upgrade did-cli: ${error.message}`, true, yellow)
      process.exit(0)
    }
    exec(`did-cli --version`, (_error, version) => {
      printSeparator(`Successfully upgraded did-cli to version ${version.trim()}`, true, green)
    })
  })
}
