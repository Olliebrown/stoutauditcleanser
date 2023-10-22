import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'
import Requirement from './Requirement.js'
import { abbreviate, makeKey, toTitleCase } from './abbreviator.js'

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

    // Initialize internal values
    this.name = abbreviate(toTitleCase(this.getHeading().trim()))
    this.innerId = this.programRoot.textContent.match(/RG-\d+/)?.[0] ?? ''
    this.key = makeKey(this.name)
    this.requirements = this.getProgramRequirements()
  }

  /**
   * If all requirements are satisfied, then this is considered satisfied
   * @returns {bool} Weather or not this program is satisfied (e.g. completed)
   */
  isSatisfied () {
    // Something is wrong so just return incomplete
    if (!Array.isArray(this.requirements) || this.requirements.length < 1) {
      return Program.SATISFIED_TYPE.INCOMPLETE
    }

    // Check each requirement
    return this.requirements.reduce((complete, requirement) => {
      switch (complete) {
        // Once we have an incomplete, we can't go back
        case Program.SATISFIED_TYPE.INCOMPLETE:
          return Program.SATISFIED_TYPE.INCOMPLETE

        // Never return to 'complete' status once we are in-progress
        case Program.SATISFIED_TYPE.IN_PROGRESS:
          if (requirement.isSatisfied() === Program.SATISFIED_TYPE.COMPLETE) {
            return Program.SATISFIED_TYPE.IN_PROGRESS
          }
      }

      // Otherwise, just return the status of the current requirement
      return requirement.isSatisfied()
    })
  }

  /**
   * Extract and return just the text of the program's header
   * @returns {string} The text within the program's header row
   */
  getHeading () {
    return this.programHeaderNode.textContent
  }

  /**
   * Extract the requirements and convert them to an array of Requirement objects
   * @returns {Array(Requirement)} Array of Requirement objects extracted from the HTML
   */
  getProgramRequirements () {
    // Extract the requirement nodes (all TD nodes)
    const requirementNodes = this.mainTable.querySelectorAll(QUERIES.requirementHeader)

    // Filter out informational only nodes
    const filteredNodes = Array.from(requirementNodes).filter((node) => {
      return !node.textContent.match(REGEX.informationalOnly)
    })

    // Switch to parents (TR) and return
    return Array.from(filteredNodes).map(node => new Requirement(node.parentNode))
  }
}

// Enum for requirement satisfaction status
Program.SATISFIED_TYPE = Object.freeze({
  COMPLETE: 'COMPLETE',
  IN_PROGRESS: 'IN_PROGRESS',
  INCOMPLETE: 'INCOMPLETE'
})
