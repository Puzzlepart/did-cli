import { sortByBestMatch } from '../../../utils/sortByBestMatch'
import { Property } from './types'

/**
 * Get field map prompts for customers
 */
export default (fields: string[]) => {
  const properties: Property[] = [
    {
      name: 'key',
      message: 'Key property'
    },
    {
      name: 'name',
      message: 'Name property'
    },
    {
      name: 'description',
      message: 'Description property'
    },
    {
      name: 'icon',
      message: 'Icon property'
    },
    {
      name: 'webLink',
      message: 'Web link property'
    }
  ]
  return properties.map((p) => {
    return {
      ...p,
      type: 'list',
      default: p.name,
      choices: [
        !['_id', 'key'].includes(p.name) && {
          name: 'No mapping',
          value: null
        },
        ...sortByBestMatch(p.name, fields)
      ].filter(Boolean)
    }
  })
}
