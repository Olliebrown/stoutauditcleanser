import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

import AuditNode from './AuditNode.js'
import SubRequirement from './SubRequirement.js'

/**
 * An object for examining one top-level requirement within a program
 * or sub-program (minor, certificate, etc.)
 */
export default class Requirement extends AuditNode {
  // References to DOM elements used for extraction of details
  #headingRowNode = null
  #programRowNode = null
  #programBodyNode = null
  #programBodyIndex = null

  // Initialize derived values
  #satisfiedText = ''
  #requirementID = ''
  #description = ''

  /**
   * Build a program requirement object from the TR node of its heading
   * @param {HTMLElement} headingRowNode The TR node that contains the top-level requirement's heading
   */
  constructor (headingRowNode) {
    super()

    // Save references to the key nodes for this requirement
    this.#headingRowNode = headingRowNode
    this.#programRowNode = headingRowNode.parentElement.parentElement.parentElement.parentElement.parentElement
    this.#programBodyNode = this.#programRowNode.parentElement

    // Where is this requirement within the program body?
    this.#programBodyIndex = Array.from(this.#programBodyNode.children)
      .findIndex(node => node === this.#programRowNode)

    // Set name and key
    this._initialize(this.#programRowNode, /RQ-\d+/)

    // Initialize derived values
    this._extractDescription()
  }

  // Accessors for private values
  getDescription () { return this.#description }
  getRequirementID () { return this.#requirementID }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {
    if (this.#satisfiedText === 'Satisfied') {
      return AuditNode.SATISFIED_TYPE.COMPLETE
    }

    return AuditNode.SATISFIED_TYPE.INCOMPLETE
  }

  /**
   * Is this a general education / Stout Core requirement? Includes all requirements
   * that have 'GenEd' in the name as well as 'RES' and 'GLP' requirements.
   * @returns {bool} Whether or not this requirement is a GenEd requirement
   */
  isGenEd () {
    return this.getName().includes('GenEd') ||
      this.getName().includes('RES') ||
      this.getName().includes('GLP')
  }

  /**
   * Extract and return just the text of the requirement's header
   * @returns {string} The text within the requirement's header row
   */
  _extractHeading () {
    return this.#headingRowNode.textContent
  }

  _extractDescription () {
    // Extract the description text
    const requirementsArray = Array.from(this.#programBodyNode.children)
    const descriptionMatch = requirementsArray[this.#programBodyIndex + 1]
      .textContent.match(REGEX.requirementDescription)
    if (descriptionMatch) {
      this.#satisfiedText = descriptionMatch.groups.satisfied
      this.#requirementID = descriptionMatch.groups.ID
      this.#description = descriptionMatch.groups.description
    } else {
      console.warn('Requirement Description regex failed')
      console.warn('------------------------')
      console.warn(this.getName())
      console.warn('------------------------')
      console.warn(requirementsArray[this.#programBodyIndex + 1].textContent.trim())
      console.warn('------------------------')
    }
  }

  /**
   * Get the array of nodes that contain this requirements sub-requirements
   * @returns {Array(HTMLElement)} Array of the elements that contain the sub-requirements or an empty array
   */
  _extractSubNodes () {
    // Get array of all the requirements in the entire program
    const requirementsArray = Array.from(this.#programBodyNode.children)

    // Build array of sub-requirement rows
    const subRequirements = []
    for (let i = this.#programBodyIndex + 2; i < requirementsArray.length; i++) {
      const headerNode = requirementsArray[i].querySelector(`:scope ${QUERIES.requirementHeader}`)
      if (headerNode) {
        subRequirements.push(requirementsArray[i])
      } else {
        break
      }
    }

    // Remove empty sub-requirements
    return subRequirements.filter(node => node.textContent.trim() !== '')
      .reduce((nodeList, node) => {
        // Find table tag that contains this sub-requirement
        let tableNode = node
        while (tableNode.tagType.toLowerCase() !== 'table' && tableNode.parentElement) {
          tableNode = tableNode.parentElement
        }

        // Ignore this node if we didn't find a table tag (unlikely)
        if (tableNode?.tagType.toLowerCase() !== 'table') {
          return nodeList
        }

        // Convert to proper sub-requirement and append
        return [...nodeList, new SubRequirement(tableNode)]
      }, [])
  }
}
