export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {})
  const { customerKey, key, createdAt, inactive } = mappedProperties
  const _id = [customerKey, key].join(' ')
  return {
    ...mappedProperties,
    _id,
    tag: _id,
    inactive: inactive === true,
    createdAt: new Date(createdAt) || new Date(),
    updatedAt: new Date(createdAt) || new Date(),
  }
}
