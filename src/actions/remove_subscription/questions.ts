import { find } from 'underscore'

export default (subscriptions: any[]) => [
  {
    type: 'list',
    name: 'subscriptionId',
    message: 'Select subscription',
    choices: subscriptions.map((sub) => ({
      value: sub._id,
      name: sub.name
    }))
  },
  {
    type: 'confirm',
    name: 'dropDatabase',
    message: ({ subscriptionId }) => {
      const { db } = find(subscriptions, (s) => s._id === subscriptionId)
      return `Delete database ${db}?`
    }
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: ({ subscriptionId }) => {
      const { name } = find(subscriptions, (s) => s._id === subscriptionId)
      return `Are you sure you want to remove subscription ${name}?`
    }
  }
]
