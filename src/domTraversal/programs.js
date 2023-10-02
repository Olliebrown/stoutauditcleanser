import { getRootDoc } from './pageRoot.js'
import { QUERIES, REGEX } from './queriesAndRegex.js'

// Get list of header nodes for all major tables on page
export function getProgramNodes () {
  // Look for all header nodes first
  const headerNodes = getRootDoc().querySelectorAll(QUERIES.programHeader)
  if (headerNodes.length < 1) {
    throw new Error('Could not find program header nodes')
  }

  // Extract the info into three categories
  const generalNodes = []
  const universityNodes = []
  const programNodes = []

  Array.from(headerNodes).forEach((header) => {
    if (header.textContent.match(REGEX.generalHeader)) {
      generalNodes.push(header)
    } else if (header.textContent.match(REGEX.universityRequirements)) {
      universityNodes.push(header)
    } else {
      programNodes.push(header)
    }
  })

  // Return back categorized info
  return [generalNodes, universityNodes, programNodes]
}
