import { exec } from 'child_process'
import fs from 'fs'
import { pick } from 'underscore'
import { promisify } from 'util'
import packageJson from '../package.json'

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
export function envToJson(): Record<string, string> {
  return pick({ ...process.env }, packageJson.env) as Record<string, string>
}


/**
 * Converts .env to arguments string
 */
export function envToArgs(): string {
  return packageJson.env.reduce((str_, key) => {
    const value = process.env[key]
    return str_ + ` --${key}="${value}"`
  }, '')
}