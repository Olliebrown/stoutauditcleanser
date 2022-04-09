import { makeLogger } from '../util/logger.js'
import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

/**
 * An object for examining one top-level requirement within a program
 * or sub-program (minor, certificate, etc.)
 */
export default class Requirement {
  /**
   * Build a program requirement object from the TR node of its heading
   * @param {HTMLElement} headingRowNode The TR node that contains the top-level requirement's heading
   */
  constructor (headingRowNode) {
    // Save references to the key nodes for this requirement
    this.headingRowNode = headingRowNode
    this.programRowNode = headingRowNode.parentElement.parentElement.parentElement.parentElement.parentElement
    this.programBodyNode = this.programRowNode.parentElement

    // Where is this requirement within the program body?
    this.programBodyIndex = Array.from(this.programBodyNode.children)
      .findIndex(node => node === this.programRowNode)

    // Make a logger for this object
    this.LOG = makeLogger(`REQ ${this.getHeading()}`, 'lightblue', 'black')

    // Initialize derived values
    this.extractDescriptionText()
    this.name = this.getHeading()
    this.subRequirements = this.getSubRequirements()
    this.satisfied = this.isSatisfied()
  }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {
    return (
      this.satisfiedText === 'Satisfied'
    )
  }

  /**
   * Extract and return just the text of the requirement's header
   * @returns {string} The text within the requirement's header row
   */
  getHeading () {
    return this.headingRowNode.textContent
  }

  extractDescriptionText () {
    // Extract the description text
    const requirementsArray = Array.from(this.programBodyNode.children)
    const descriptionMatch = requirementsArray[this.programBodyIndex + 1]
      .textContent.match(REGEX.requirementDescription)
    if (descriptionMatch) {
      this.satisfiedText = descriptionMatch.groups.satisfied
      this.requirementID = descriptionMatch.groups.ID
      this.description = descriptionMatch.groups.description
    } else {
      this.LOG.error('Description regex failed')
    }
  }

  /**
   * Get the array of nodes that contain this requirements sub-requirements
   * @returns {Array(HTMLElement)} Array of the elements that contain the sub-requirements or an empty array
   */
  getSubRequirements () {
    // Get array of all the requirements in the entire program
    const requirementsArray = Array.from(this.programBodyNode.children)

    // Build array of sub-requirement rows
    const subRequirements = []
    for (let i = this.programBodyIndex + 2; i < requirementsArray.length; i++) {
      const headerNode = requirementsArray[i].querySelector(`:scope ${QUERIES.requirementHeader}`)
      if (!headerNode) {
        subRequirements.push(requirementsArray[i])
      } else {
        break
      }
    }

    // Return the (possibly empty) array
    return subRequirements
  }
}
