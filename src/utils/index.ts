import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

export const writeFileAsync = promisify(fs.writeFile)
export const readFileAsync = promisify(fs.readFile)
export const execAsync = promisify(exec)

/**
 * Converts JSON to .env
 * 
 * @param json - JSON
 * 
 * @returns String in .env format
 */
export function jsonToEnv(json: any) {
  return Object.keys(json)
    .map((key) => `${key}=${json[key]}`)
    .join('\n')
}

/**
 * Converts .env to JSON
 */
export async function envToJson() {
  const content = (await readFileAsync(path.resolve(__dirname, '../.env'))).toString().split('\n')
  return content.reduce((obj, str) => {
    const [key, value] = str.split('=')
    return {
      ...obj,
      [key]: value
    }
  }, {})
}


/**
 * Converts .env to arguments string
 */
export async function envToArgs() {
  const content = (await readFileAsync(path.resolve(__dirname, '../.env'))).toString().split('\n')
  return content.reduce((str_, str) => {
    const [key, value] = str.split('=')
    return str_ + ` --${key}=${value}`
  }, '')
}