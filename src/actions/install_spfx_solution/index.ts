require('dotenv').config()
import { SPFetchClient } from "@pnp/nodejs-commonjs";
import { sp } from "@pnp/sp-commonjs";
import got from "got";
import inquirer from 'inquirer';
import { cyan, green, printSeparator, yellow } from '../../utils/log';
import questions from './questions';

const SPPKG_GITHUB_URL = ({ githubToken }: Record<string, string>) =>
  `https://${githubToken}@raw.githubusercontent.com/puzzlepart/did-spfx/main/sharepoint/solution/did-spfx.sppkg`
const CONFIG_LIST_NAME = 'did_spfx_configuration'

/**
 * Set up SPFetchClient
 * 
 * @param input Input (siteUrl, clientId, clientSecret)
 * 
 * @returns void
 */
const setup = (input: Record<string, string>) =>
  sp.setup({
    sp: {
      fetchClientFactory: () => {
        return new SPFetchClient(
          input.siteUrl,
          input.clientId,
          input.clientSecret
        )
      }
    }
  })

export async function action(args) {
  try {
    printSeparator('spfx install', true, cyan)
    const input: Record<string, string> = {
      ...args,
      ...(await inquirer.prompt(questions(args)))
    }
    setup(input)
    const response = await got(SPPKG_GITHUB_URL(input), {
      headers: { 'Accept': '*/*' }
    })
    const buffer = Buffer.from(response.rawBody)
    const appCatalogWeb = await sp.getTenantAppCatalogWeb()
    printSeparator(`Ensuring list ${CONFIG_LIST_NAME}`)
    const { list, created } = await appCatalogWeb.lists.ensure(
      CONFIG_LIST_NAME,
      '',
      100,
      false, {
      Hidden: true
    })
    if (created) {
      await Promise.all([
        list.fields.getByInternalNameOrTitle('Title').update({ Title: 'Key' }),
        list.fields.addMultilineText('Value', undefined)
      ])
      await list.items.add({
        Title: 'API_KEY',
        Value: input.didApiKey
      })
      printSeparator(`List ${CONFIG_LIST_NAME} created`)
    } else {
      printSeparator(`List ${CONFIG_LIST_NAME} already created`)
    }
    const { data } = await appCatalogWeb.getAppCatalog(appCatalogWeb).add('did-spfx.sppkg', buffer, true)
    const [app] = await appCatalogWeb.getAppCatalog(appCatalogWeb).filter(`Title eq '${data.Title}'`).select('ID', 'AppCatalogVersion').get()
    await appCatalogWeb.getAppCatalog(appCatalogWeb).getAppById(app.ID).deploy(true)
    printSeparator(`Successfully deployed version ${app.AppCatalogVersion}.`, true, green)
  } catch (error) {
    printSeparator(`Failed to install SPFx: ${error.message}`, true, yellow)
  } finally {
    process.exit(0)
  }
}
