import { sortByBestMatch } from '../../../utils/sortByBestMatch'
import { Property } from './types'

export default (fields: string[]) => {
  const properties: Property[] = [
    {
      name: 'periodId',
      message: 'Period ID property'
    },
    {
      name: 'userId',
      message: 'User ID property'
    },
    {
      name: 'createdAt',
      message: 'Created at property'
    },
    {
      name: 'hours',
      message: 'Hours property'
    }
  ]
  return properties.map((p) => ({
    ...p,
    type: 'list',
    default: p.name,
    choices: sortByBestMatch(p.name, fields)
  }))
}