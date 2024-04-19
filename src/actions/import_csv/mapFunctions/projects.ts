import lodash from 'lodash'

/**
 * Sanitize key, removing special characters and spaces.
 * 
 * @param key Key to sanitize
 */
function sanitizeKey(key: string) {
  return key.replace(/[^a-zA-Z0-9]/g, '')
}

export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    if (!item[fieldMap[key]]) return obj
    let value = item[fieldMap[key]]
    if (['key', 'customerKey'].includes(key)) {
      value = sanitizeKey(value)
    }
    return {
      ...obj,
      [key]: value
    }
  }, {})
  const { customerKey, key, inactive } = mappedProperties
  const _id = [customerKey, key].join(' ')
  return lodash.omit({
    ...mappedProperties,
    _id,
    name: mappedProperties.name ?? [customerKey, key].join(' '),
    tag: _id,
    labels: [mappedProperties.primaryLabel, mappedProperties.secondaryLabel].filter(Boolean),
    inactive: inactive === true,
    createdAt: new Date(),
    updatedAt: new Date()
  }, ['primaryLabel', 'secondaryLabel'])
}
