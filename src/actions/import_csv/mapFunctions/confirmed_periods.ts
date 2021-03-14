import { omit } from "underscore"
import { PeriodIdWrongFormatError } from "../errors"

function generatePeriodId(periodId: string, userId: string) {
  return `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '')
}

export default (fieldMap: Record<string, string>, { time_entries = [] }: { time_entries: any[] }) => (item: Record<string, any>) => {
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

  const _id = generatePeriodId(periodId, userId)
  const events = time_entries.filter(entry => entry.periodId === _id).map(event => {
    return omit(event, 'week', 'month', 'year', 'userId', 'periodId')
  })
  return {
    ...mappedProperties,
    duration: parseFloat(hours),
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
    week,
    month,
    year,
    _id,
    events
  }
}
