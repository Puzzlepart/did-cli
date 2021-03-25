export default (issues: any[]) => [
  {
    type: "autocomplete",
    name: 'issue',
    message: "Select issue",
    source: async (_a: any, input: string) => {
      return issues
        .filter(
          ([id, , name]) =>
            id &&
            `${id} ${name}`.toLowerCase().indexOf((input || '').toLowerCase()) !== -1
        )
        .map(([id, , name, labels]) => ({
          value: [id, name, labels],
          name: `${id}: ${name} (${labels})`
        }))
    }
  },
  {
    type: "list",
    name: 'branch_prefix',
    message: "Branch prefix",
    choices: ['feature/', 'bugfix/', 'hotfix/']
  }
]
