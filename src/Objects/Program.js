import { QUERIES } from '../domTraversal/queriesAndRegex.js'
import { makeLogger } from '../util/logger.js'
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

    // Make a logger for this object
    this.LOG = makeLogger(`${this.getHeading().trim()}`, 'pink', 'black')

    // Initialize internal values
    this.name = this.getHeading().trim()
    this.requirements = this.getProgramRequirements()
    this.satisfied = this.isSatisfied()
  }

  output () {
    // Output the overall program status
    if (this.satisfied) {
      this.LOG.green('Complete')
    } else {
      this.LOG.red('Incomplete')
    }

    // Find length of longest label
    let maxLabelLength = 0
    this.requirements.forEach(req => {
      if (req.getHeading().length > maxLabelLength) {
        maxLabelLength = req.getHeading().length
      }
    })

    // Output status of each requirement
    this.requirements.forEach((req) => req.output(maxLabelLength))
  }

  /**
   * If all requirements are satisfied, then this is considered satisfied
   * @returns {bool} Weather or not this program is satisfied (e.g. completed)
   */
  isSatisfied () {
    if (!Array.isArray(this.requirements) || this.requirements.length < 1) {
      return false
    }

    return !this.requirements.find((requirement) => !requirement.isSatisfied())
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

    // Switch to parents (TR) and return
    return Array.from(requirementNodes).map(node => new Requirement(node.parentNode))
  }
}
