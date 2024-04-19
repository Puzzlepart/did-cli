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
    if (['key'].includes(key)) {
      value = sanitizeKey(value)
    }
    return {
      ...obj,
      [key]: value
    }
  }, {})
  const { 
    key,
    name,
     createdAt, 
     inactive 
    } = mappedProperties
  return {
    _id: key,
    ...mappedProperties,
    name: name ?? key,
    icon: 'Page',
    inactive: inactive === true,
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    updatedAt: createdAt ? new Date(createdAt) : new Date()
  }
}
