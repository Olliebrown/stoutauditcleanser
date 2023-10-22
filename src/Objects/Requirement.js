import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

import SubRequirement from './SubRequirement.js'
import Program from './Program.js'
import { abbreviate, makeKey, toTitleCase } from './abbreviator.js'

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

    // Set name and key
    this.name = abbreviate(toTitleCase(this.getHeading().trim()))
    this.innerId = this.programRowNode.textContent.match(/RQ-\d+/)?.[0] ?? ''
    this.key = makeKey(this.name)

    // Initialize derived values
    this.extractDescriptionText()
    this.subRequirements = this.getSubRequirements()
  }

  toString () {
    return `${this.name}: ${this.satisfiedText}`
  }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {
    if (this.satisfiedText === 'Satisfied') {
      return Program.SATISFIED_TYPE.COMPLETE
    }

    return Program.SATISFIED_TYPE.INCOMPLETE
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
      console.warn('Requirement Description regex failed')
      console.warn('------------------------')
      console.warn(this.name)
      console.warn('------------------------')
      console.warn(requirementsArray[this.programBodyIndex + 1].textContent.trim())
      console.warn('------------------------')
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

    // Remove empty sub-requirements then convert to objects
    return subRequirements.filter(node => node.textContent.trim() !== '')
      .map(node => new SubRequirement(node))
  }
}
