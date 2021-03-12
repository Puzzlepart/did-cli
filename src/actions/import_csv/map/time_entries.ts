import { PeriodIdWrongFormatError } from "../errors"

function generatePeriodId(periodId: string, userId: string) {
  return `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '')
}

export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {}) as any
  let {
    periodId,
    week,
    month,
    year,
    startDate,
    endDate,
    duration,
    userId,
  } = mappedProperties
  if (periodId && periodId.split('_').length !== 3) {
    throw PeriodIdWrongFormatError
  }
  if (periodId) {
    [week, month, year] = periodId.split('_')
  } else {
    periodId = [week, month, year].join('_')
  }
  return {
    ...mappedProperties,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    duration: parseFloat(duration),
    week: parseInt(week),
    month: parseInt(month),
    year: parseInt(year),
    periodId: generatePeriodId(periodId, userId)
  }
}
