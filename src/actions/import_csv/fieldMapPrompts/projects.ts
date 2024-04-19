import { sortByBestMatch } from '../../../utils/sortByBestMatch'
import { Property } from './types'

function shouldSkip(property: Property, skip: string[]) {
  return skip.includes(property.name)
}

export default (fields: string[], args: Record<string, any>) => {
  const skip = args?.skip ? args.skip.split(',') : []
  const properties: Property[] = [
    {
      name: 'customerKey',
      message: 'Customer key property'
    },
    {
      name: 'key',
      message: 'Project key property'
    },
    {
      name: 'name',
      message: 'Name property'
    },
    args.applyLabels && {
      name: "primaryLabel",
      message: "Primary label property"
    },
    args.applyLabels && {
      name: "secondaryLabel",
      message: "Secondary label property"
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
  return properties.filter(p => !!p && !shouldSkip(p, skip))
    .map((p) => {
      const isKey = ['customerKey', 'key'].includes(p.name)
      return {
        ...p,
        type: 'list',
        default: p.name,
        choices: [
          !isKey && {
            name: 'No mapping',
            value: null
          },
          ...sortByBestMatch(p.name, fields)
        ].filter(Boolean)
      }
    })
}
