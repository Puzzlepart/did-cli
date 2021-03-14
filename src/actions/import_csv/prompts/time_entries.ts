const { findBestMatch } = require('string-similarity')

const sortByBestMatch = (field, fields) => {
  return findBestMatch(field, fields)
    .ratings.sort((a, b) => b.rating - a.rating)
    .map((a) => a.target)
}

export default (fields, args) => {
  return [
    {
      name: '_id',
      message: 'ID property',
      default: 'id'
    },
    {
      name: 'projectId',
      message: 'Project id/tag property'
    },
    {
      name: 'title',
      message: 'Title property'
    },
    {
      name: 'body',
      message: 'Body property'
    },
    {
      name: 'duration',
      message: 'Duration property'
    },
    {
      name: 'startDateTime',
      message: 'Start date time property'
    },
    {
      name: 'endDateTime',
      message: 'End date time property'
    },
    {
      name: 'periodId',
      message: 'Period ID property',
      choices: [{
        value: null,
        name: 'Skip'
      }]
    },
    {
      name: 'week',
      message: 'Week number property',
      when: ({ periodId }) => !periodId
    },
    {
      name: 'month',
      message: 'Month number property',
      when: ({ periodId }) => !periodId
    },
    {
      name: 'year',
      message: 'Year property',
      when: ({ periodId }) => !periodId
    },
    {
      name: 'userId',
      message: 'User ID property'
    }
  ].map((p) => ({
    ...p,
    type: 'list',
    default: p.name,
    choices: [...(p.choices || []), ...sortByBestMatch(p.name, fields)],
    when: !args[p.name]
  }))
}
