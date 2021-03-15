require('dotenv').config()
import packageJson from '../../package.json'
import { envToArgs, execAsync } from '../../utils'
import { cyan, green, printSeparator, yellow } from '../../utils/log'

/**
 * Upgrade
 * 
 * @description Upgrade did-cli
 */
export async function action({ branch, reset }) {
  printSeparator('Upgrading did-cli', true, cyan)
  let url = packageJson?.repository?.url
  if (branch) {
    url += `#${branch}`
  }

  printSeparator(`Upgrading did-cli from ${url}`)

  const envArgs = await envToArgs()
  
  try {
    await execAsync(`npm i -g "${url}"`)
    if (!reset) await execAsync(`did-cli init ${envArgs}`)
    const { stdout } = await execAsync(`did-cli --version`)
    printSeparator(`Successfully upgraded ${cyan('did-cli')} to version ${stdout.trim()}`, true, green)
  } catch (error) {
    printSeparator(`Failed to upgrade ${cyan('did-cli')}: ${error.message}`, true, yellow)
  } finally {
    process.exit(0)
  }
}
