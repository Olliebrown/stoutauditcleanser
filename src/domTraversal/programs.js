import { getRootDoc } from './pageRoot.js'
import { QUERIES, REGEX } from './queriesAndRegex.js'

// Get list of header nodes for all major tables on page
export function getProgramNodes () {
  // Look for all header nodes first
  const headerNodes = getRootDoc().querySelectorAll(QUERIES.programHeader)
  if (headerNodes.length < 1) {
    throw new Error('Could not find program header nodes')
  }

  // Extract the nodes that are program headers (skips general nodes)
  const programNodes = Array.from(headerNodes).filter((header) => (
    !header.textContent.match(REGEX.generalHeaders))
  )

  // Return back filtered array
  return programNodes
}
