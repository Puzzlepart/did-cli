export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {})
  return {
    ...mappedProperties,
    createdAt: mappedProperties.createdAt || new Date(),
    updatedAt: mappedProperties.createdAt || new Date(),
  }
}
