export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {})
  const { createdAt } = mappedProperties
  return {
    ...mappedProperties,
    createdAt: new Date(createdAt) || new Date(),
    updatedAt: new Date(createdAt) || new Date(),
  }
}
