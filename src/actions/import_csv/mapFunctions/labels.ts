import randomColor from 'randomcolor'
import { t9r } from '../../../utils'

export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    if (!item[fieldMap[key]]) return obj
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {})
  if (!!fieldMap.descriptionFormat && !fieldMap.description && !!mappedProperties.name) {
    mappedProperties.description = t9r(fieldMap.descriptionFormat, mappedProperties)
  }
  if (Object.keys(mappedProperties).length === 0) return null
  const { name } = mappedProperties
  return {
    ...mappedProperties,
    _id: name.replace(/[^a-zA-Z0-9]/g, ''),
    color: mappedProperties.color ?? randomColor({
      format: 'hex',
    }),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
