export default (fieldMap) => (item) => {
  const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {}) as any
  const { periodId, hours, createdAt, userId } = mappedProperties
  if (periodId.split('_').length !== 3)
    throw new Error(
      'periodId has wrong format! Needs to be of format week_month_year.'
    )
  const [week, month, year] = periodId
    .split('_')
    .map((str) => parseInt(str, 10))
  return {
    ...mappedProperties,
    duration: parseFloat(hours),
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
    week,
    month,
    year,
    periodId: `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '')
  }
}
