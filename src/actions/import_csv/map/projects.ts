export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    ...Object.keys(fieldMap).reduce((obj, key) => {
      return {
        ...obj,
        [key]: item[fieldMap[key]]
      }
    }, {})
  }
}
