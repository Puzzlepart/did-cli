export function jsonToEnv(json) {
  return Object.keys(json)
    .map((key) => `${key}=${json[key]}`)
    .join('\n')
}