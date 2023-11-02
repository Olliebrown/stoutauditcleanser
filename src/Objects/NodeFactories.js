import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

// Core objects that we can generate
import Program from './Program.js'
import Requirement from './Requirement.js'
import SubRequirement from './SubRequirement.js'

// Get list of header nodes for all major tables on page
export function makeProgramArrays (rootDoc) {
  // Look for all header nodes first
  const headerNodes = rootDoc.querySelectorAll(QUERIES.programHeader)
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

  // Convert the node elements into Program objects and return
  return {
    studentName: rootDoc.querySelector(QUERIES.studentName)?.textContent ?? 'Name not found',
    generalNodes: generalNodes?.map(node => new Program(node)) ?? [],
    universityNodes: universityNodes?.map(node => new Program(node)) ?? [],
    programNodes: programNodes?.map(node => new Program(node)) ?? []
  }
}

export function makeRequirementsArray (rootNode) {
  // Extract the requirement nodes (all TD nodes)
  const requirementNodes = rootNode.querySelectorAll(QUERIES.requirementHeader)

  // Filter out informational only nodes
  const filteredNodes = Array.from(requirementNodes).filter((node) => {
    return !node.textContent.match(REGEX.informationalOnly)
  })

  // Switch to parents (TR) and return
  return Array.from(filteredNodes).map((node, i, array) => (
    new Requirement(node.parentNode, array[i + 1]?.parentNode.textContent)
  ))
}

export function makeSubRequirementsArray (rootNode) {
  const subRequirementNodes = rootNode.querySelectorAll(QUERIES.subRequirementHeader)
  const mappedNodes = Array.from(subRequirementNodes).map((node) => (
    node.parentNode.parentNode.parentNode
  ))

  return mappedNodes.map(node => new SubRequirement(node))
  // // Get array of all the requirements in the entire program
  // const requirementsArray = Array.from(rootNode.children)

  // // Build array of sub-requirement rows
  // const subRequirements = []
  // for (let i = rootIndex + 2; i < requirementsArray.length; i++) {
  //   const headerNode = requirementsArray[i].querySelector(`:scope ${QUERIES.requirementHeader}`)
  //   if (headerNode) {
  //     subRequirements.push(requirementsArray[i])
  //   } else {
  //     break
  //   }
  // }

  // // Remove empty sub-requirements
  // return subRequirements.filter(node => node.textContent.trim() !== '')
  //   .reduce((nodeList, node) => {
  //     // Find table tag that contains this sub-requirement
  //     let tableNode = node
  //     while (tableNode.tagType.toLowerCase() !== 'table' && tableNode.parentElement) {
  //       tableNode = tableNode.parentElement
  //     }

  //     // Ignore this node if we didn't find a table tag (unlikely)
  //     if (tableNode?.tagType.toLowerCase() !== 'table') {
  //       return nodeList
  //     }

  //     // Convert to proper sub-requirement and append
  //     return [...nodeList, new SubRequirement(tableNode)]
  //   }, [])
}
