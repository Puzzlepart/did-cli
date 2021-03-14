const { findBestMatch } = require('string-similarity')

const sortByBestMatch = (field, fields) => {
  return findBestMatch(field, fields)
    .ratings.sort((a, b) => b.rating - a.rating)
    .map((a) => a.target)
}

export default (fields) => {
  return [
    {
      name: 'periodId',
      message: 'Period ID property'
    },
    {
      name: 'userId',
      message: 'User ID property'
    },
    {
      name: 'createdAt',
      message: 'Created property'
    },
    {
      name: 'hours',
      message: 'Hours property'
    }
  ].map((p) => ({
    ...p,
    type: 'list',
    default: p.name,
    choices: sortByBestMatch(p.name, fields)
  }))
}
