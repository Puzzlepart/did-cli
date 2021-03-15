import got from 'got'

export default (args: any, customers: any[]) => [
  {
    type: 'autocomplete',
    name: 'customerKey',
    message: 'Select customer',
    when: () => !args.customerKey,
    source: async (_a: any, input: string) => {
      return customers
        .filter(
          (c) =>
            c.name.toLowerCase().indexOf((input || '').toLowerCase()) !== -1
        )
        .map((c) => ({
          value: c.key,
          name: c.name
        }))
    },
  },
  {
    type: 'input',
    name: 'name',
    message: 'What\'s the name of the project?',
    default: args.name,
    when: () => !args.name
  },
  {
    type: 'input',
    name: 'key',
    message: 'What\'s the shortname for the project?',
    default: args.key,
    when: () => !args.key
  },
  {
    type: 'input',
    name: 'description',
    message: 'Describe the project for me?',
    default: args.description,
    when: () => !args.description
  },
  {
    type: 'autocomplete',
    name: 'icon',
    message: 'Select an icon from Office UI Fabric',
    source: async (_a: any, input: string) => {
      const response = await got(
        'https://raw.githubusercontent.com/OfficeDev/office-ui-fabric-core/master/src/data/icons.json',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      const items: any[] = JSON.parse(response.body)
      return items
        .filter(
          (f) =>
            f.name.toLowerCase().indexOf((input || '').toLowerCase()) !== -1
        )
        .map((f) => f.name)
    },
    default: args.icon,
    when: () => !args.icon
  }
]
