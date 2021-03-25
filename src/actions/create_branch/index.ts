require('dotenv').config()
import inquirer from 'inquirer'
import { execAsync } from '../../utils'
import { cyan, printSeparator } from '../../utils/log'
import questions from './questions'

function removeShortWords(str: string) {
  return str.split(' ').filter(part => part.length > 3).join('-')
}

/**
 * Generate branch name
 * 
 * @param issue - Issue details
 * @param branch_prefix - Branch prefix
 * @returns generated branch name
 */
function generateBranchName([id, name], branch_prefix: string) {
  return branch_prefix + [removeShortWords(name.replace(/[^a-zA-Z ]/g, "")), id].join('-').toLowerCase()
}

/**
 * Create branch
 * 
 * @description Creates a branch for the specified issue
 * 
 * @remarks A CLI action file must return a function named action
 * 
 * @param args - Args
 */
export async function action() {
  printSeparator('Create branch', true, cyan)

  let { stdout: issues_ } = await execAsync(`cd ${process.env.DID_LOCAL_PATH} && gh issue list`)
  const issues = issues_.split('\n').map(str => {
    return str.split(`\t`)
  })
  const input = await inquirer.prompt(questions(issues))

  const branch_name = generateBranchName(input.issue, input.branch_prefix)


  const { stdout } = await execAsync(`cd ${process.env.DID_LOCAL_PATH} && git checkout -b ${branch_name}`)

  console.log(stdout)
  console.log(branch_name)
}
