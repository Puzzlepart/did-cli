export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {}) as any
  const { periodId, startDate, endDate, duration, userId } = mappedProperties
  if (periodId.split('_').length !== 3)
    throw new Error(
      'periodId has wrong format! Needs to be of format week_month_year.'
    )
  const [week, month, year] = periodId
    .split('_')
    .map((str_: string) => parseInt(str_, 10))
  return {
    ...mappedProperties,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    duration: parseFloat(duration),
    week,
    month,
    year,
    periodId: `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '')
  }
}
