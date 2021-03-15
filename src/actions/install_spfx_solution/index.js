require('dotenv').config()
const log = console.log
const { SPFetchClient } = require('@pnp/nodejs')
const { sp } = require('@pnp/sp/presets/all')

const setup = (clientId, clientSecret) =>
  sp.setup({
    sp: {
      fetchClientFactory: () => {
        return new SPFetchClient(
          'https://puzzlepart.sharepoint.com/sites/pp365',
          clientId,
          clientSecret
        )
      }
    }
  })

export async function action() {
  log('--------------------------------------------------------')
  log('[did-cli] spfx install')
  log('--------------------------------------------------------')

  const { clientId, clientSecret } = await inquirer.prompt(
    require('./_prompts.json')
  )
  setup(clientId, clientSecret)
  const w = await sp.web.get()
  console.log(w.Title)
}

module.exports = install_spfx_solution
