import { getRootDoc } from './pageRoot.js'
import { QUERIES, REGEX } from './queriesAndRegex.js'

// Get list of header nodes for all major tables on page
export function getProgramNodes () {
  // Look for all header nodes first
  const headerNodes = getRootDoc().querySelectorAll(QUERIES.header)
  if (headerNodes.length < 1) {
    throw new Error('Could not find program header nodes')
  }

  // Extract the nodes that are program headers (skips general nodes)
  const programNodes = Array.from(headerNodes).filter((header) => (
    !header.textContent.match(REGEX.generalRegEx))
  )

  // Return back filtered array
  return programNodes
}

export function getProgramRequirements (programNode) {
  // Move from the program node header to the main program table
  const programRoot = programNode.parentNode.parentNode.parentNode
  const mainTable = programRoot.querySelector(QUERIES.programTable)

  // Did we find it?
  if (!mainTable) {
    throw new Error('Failed to find program table')
  } else {
    // Extract the requirement nodes (all TD nodes)
    const requirementNodes = mainTable.querySelectorAll(QUERIES.reqHeaders)

    // Switch to parents (TR) and return
    return Array.from(requirementNodes).map(node => node.parentNode)
  }
}
