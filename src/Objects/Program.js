import { QUERIES } from '../domTraversal/queriesAndRegex.js'

import Requirement from './Requirement.js'

/**
 * An object for examining a program or sub-program and its requirements
 */
export default class Program {
  constructor (programHeaderNode) {
    // Save reference to program header node
    this.programHeaderNode = programHeaderNode

    // Move from the program node header to the main program table
    this.programRoot = programHeaderNode.parentNode.parentNode.parentNode

    // Try to find the main program table
    this.mainTable = this.programRoot.querySelector(QUERIES.programTable(5))
    if (!this.mainTable) {
      // Try reduced depth
      this.mainTable = this.programRoot.querySelector(QUERIES.programTable(3))
      if (!this.mainTable) {
        throw new Error('Failed to find program table')
      }
    }

    // Pre-compute values (for serialization)
    this.name = this.getHeading()
    this.satisfied = this.isSatisfied()

    // Try to build the list of requirements
    this.requirements = this.getProgramRequirements()
  }

  isSatisfied () {
    return false
  }

  /**
   * Extract and return just the text of the program's header
   * @returns {string} The text within the program's header row
   */
  getHeading () {
    return this.programHeaderNode.textContent
  }

  getProgramRequirements () {
    // Extract the requirement nodes (all TD nodes)
    const requirementNodes = this.mainTable.querySelectorAll(QUERIES.requirementHeader)

    // Switch to parents (TR) and return
    return Array.from(requirementNodes).map(node => new Requirement(node.parentNode))
  }
}
