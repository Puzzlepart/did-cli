const { findBestMatch } = require('string-similarity')

const sortByBestMatch = (field, fields) => {
  return findBestMatch(field, fields)
    .ratings.sort((a, b) => b.rating - a.rating)
    .map((a) => a.target)
}

module.exports = (fields) => {
  return [
    {
      name: '_id',
      message: 'ID property'
    },
    {
      name: 'customerKey',
      message: 'Customer key property'
    },
    {
      name: 'key',
      message: 'Key property'
    },
    {
      name: 'name',
      message: 'Name property'
    },
    {
      name: 'description',
      message: 'Description property'
    },
    {
      name: 'webLink',
      message: 'Web link property'
    }
  ].map((p) => ({
    ...p,
    type: 'list',
    default: p.name,
    choices: sortByBestMatch(p.name, fields)
  }))
}
