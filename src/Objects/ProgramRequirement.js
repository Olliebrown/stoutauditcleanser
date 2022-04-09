import { QUERIES } from '../domTraversal/queriesAndRegex.js'

/**
 * An object for examining one top-level requirement within a program
 * or sub-program (minor, certificate, etc.)
 */
export class ProgramRequirement {
  /**
   * Build a program requirement object from the TR node of its heading
   * @param {HTMLElement} headingRowNode The TR node that contains the top-level requirement's heading
   */
  constructor (headingRowNode) {
    // Save references to the key nodes for this requirement
    this.headingRowNode = headingRowNode
    this.programRowNode = headingRowNode.parentElement.parentElement.parentElement.parentElement.parentElement
    this.programBodyNode = this.programRowNode.parentElement

    this.name = this.getRequirementHeading()
    this.subRequirements = this.getSubRequirements()
  }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {

  }

  /**
   * Extract and return just the text of the requirement's header
   * @returns {string} The text within the requirement's header row
   */
  getRequirementHeading () {
    return this.headingRowNode.textContent
  }

  /**
   * Get the array of nodes that contain this requirements sub-requirements
   * @returns {Array(HTMLElement)} Array of the elements that contain the sub-requirements or an empty array
   */
  getSubRequirements () {
    // Get array of all the requirements in the entire program
    const requirementsArray = Array.from(this.programBodyNode.children)

    // Where is this requirement within the program body?
    this.programBodyIndex = requirementsArray.findIndex(node => node === this.programRowNode)

    // Build array of sub-requirement rows
    const subRequirements = []
    for (let i = this.programBodyIndex; i < requirementsArray.length; i++) {
      const headerNode = requirementsArray[i].querySelector(QUERIES.reqHeaders)
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
