import got from 'got'

module.exports = (args: any) => [
  {
    type: 'input',
    name: 'name',
    message: "What's the name of the customer?",
    default: args.name,
    when: () => !args.name
  },
  {
    type: 'input',
    name: 'key',
    message: "What's the shortname for the customer?",
    default: args.key,
    when: () => !args.key
  },
  {
    type: 'input',
    name: 'description',
    message: 'Describe the customer for me?',
    default: args.description,
    when: () => !args.description
  },
  {
    type: 'autocomplete',
    name: 'icon',
    message: 'Select an icon from Office UI Fabric',
    source: async (_a, input) => {
      const response = await got(
        'https://raw.githubusercontent.com/OfficeDev/office-ui-fabric-core/master/src/data/icons.json',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      return JSON.parse(response.body)
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
