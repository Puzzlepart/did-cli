import { PeriodIdWrongFormatError } from "../errors"

export default (fieldMap: Record<string, string>) => (item: Record<string, any>) => {
  const mappedProperties: Record<string, any> = Object.keys(fieldMap).reduce((obj, key) => {
    return {
      ...obj,
      [key]: item[fieldMap[key]]
    }
  }, {}) as any
  let {
    periodId,
    hours,
    createdAt,
    userId
  } = mappedProperties
  if (periodId && periodId.split('_').length !== 3) {
    throw PeriodIdWrongFormatError
  }
  const [week, month, year] = periodId
    .split('_')
    .map((str_: string) => parseInt(str_, 10))
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
