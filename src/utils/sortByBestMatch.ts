import { findBestMatch } from 'string-similarity'

export const sortByBestMatch = (field: string, fields: string[]) => {
  return findBestMatch(field, fields)
    .ratings.sort((a, b) => b.rating - a.rating)
    .map((a) => a.target)
}