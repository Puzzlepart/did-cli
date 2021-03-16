export default (args) => [
  {
    type: "input",
    name: 'name',
    message: "What's the name of the company?",
    default: "Contoso",
    when: !args.name
  },
  {
    type: "input",
    name: 'domain',
    message: "What's the domain of the tenant?",
    when: !args.domain
  },
  {
    type: "input",
    name: "tenantId",
    message: "What's the tenant id?",
    default: "00000000-0000-0000-0000-000000000000",
    when: ({ domain }) => !args.domain && !domain
  },
  {
    type: "confirm",
    name: "forecasting",
    message: "Should forecasting be enabled?",
    default: false
  },
  {
    type: "input",
    name: "owner",
    message: "Email address of the subscription owner?",
    default: "owner@company.com",
    when: !args.owner
  }
]
