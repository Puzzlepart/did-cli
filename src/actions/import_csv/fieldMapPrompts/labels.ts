import { sortByBestMatch } from '../../../utils/sortByBestMatch'
import { Property } from './types'

export default (fields: string[]) => {
  const properties: Property[] = [
    {
      name: 'name',
      message: 'Name property'
    },
    {
      name: 'description',
      message: 'Description property'
    },
    {
      name: 'createdAt',
      message: 'Created at property'
    },
    {
      name: 'color',
      message: 'Color property'
    },
    {
      name: 'icon',
      message: 'Icon property'
    }
  ]
  return [
    {
      type: 'input',
      name: 'descriptionFormat',
      message: 'Description format',
      default: '{{name}}'
    },
    ...properties.map((p) => ({
      ...p,
      type: 'list',
      default: p.name,
      choices: [
        p.name !== 'name' && {
          name: 'No mapping',
          value: null
        },
        ...sortByBestMatch(p.name, fields)
      ].filter(Boolean)
    })),
  ]
}