import { REGEX } from '../domTraversal/queriesAndRegex.js'

import AuditNode from './AuditNode.js'
import { makeSubRequirementsArray } from './NodeFactories.js'

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
  #programBodyNextIndex = null

  // Initialize derived values
  #satisfiedText = ''
  #requirementId = ''
  #description = ''

  /**
   * Build a program requirement object from the TR node of its heading
   * @param {HTMLElement} headingRowNode The TR node that contains the top-level requirement's heading
   */
  constructor (headingRowNode, nextNodeText) {
    super()

    // Save references to the key nodes for this requirement
    this.#headingRowNode = headingRowNode
    this.#programRowNode = headingRowNode.parentElement.parentElement.parentElement.parentElement.parentElement
    this.#programBodyNode = this.#programRowNode.parentElement

    // Where is this requirement within the program body?
    this.#programBodyIndex = Array.from(this.#programBodyNode.children)
      .findIndex(node => node === this.#programRowNode)

    // Where is the next requirement within the program body?
    if (nextNodeText) {
      this.#programBodyNextIndex = Array.from(this.#programBodyNode.children)
        .findIndex(node => node.textContent.includes(nextNodeText))
    } else {
      this.#programBodyNextIndex = this.#programBodyNode.children.length
    }

    // Initialize derived values
    this._extractDescription()

    // Set name and key
    this._initialize(this.#programRowNode, this.#requirementId)
  }

  // Accessors for private values
  getDescription () { return this.#description }
  getRequirementId () { return this.#requirementId }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {
    // Check satisfied text first
    if (this.#satisfiedText === 'Satisfied') {
      return AuditNode.SATISFIED_TYPE.COMPLETE
    }

    // Examine sub-nodes to derive status
    return super.isSatisfied()
  }

  /**
   * Extract and return just the text of the requirement's header
   * @returns {string} The text within the requirement's header row
   */
  _extractHeading () {
    return this.#headingRowNode.textContent
  }

  _extractFullText () {
    return Array.from(this.#programBodyNode.children)
      .slice(this.#programBodyIndex, this.#programBodyNextIndex)
      .map(node => node.textContent).join('\n')
  }

  _extractDescription () {
    // Extract the description text
    const requirementsArray = Array.from(this.#programBodyNode.children)
    const descNode = requirementsArray[this.#programBodyIndex + 1]
    const reqRegex = REGEX.requirementDescription.find(
      (curRegex) => descNode.textContent.match(curRegex)
    )
    if (reqRegex) {
      const descriptionMatch = descNode.textContent.match(reqRegex)
      this.#satisfiedText = descriptionMatch.groups.satisfied
      this.#requirementId = descriptionMatch.groups.ID
      this.#description = descriptionMatch.groups.description
    } else {
      console.warn('Requirement Description regex failed')
      console.warn('------------------------')
      console.warn(this.getName())
      console.warn('------------------------')
      console.warn(descNode.textContent.trim())
      console.warn('------------------------')
    }
  }

  /**
   * Get the array of nodes that contain this requirements sub-requirements
   * @returns {Array(HTMLElement)} Array of the elements that contain the sub-requirements or an empty array
   */
  _extractSubNodes () {
    const childrenNodes = Array.from(this.#programBodyNode.children)
      .slice(this.#programBodyIndex, this.#programBodyNextIndex)
    if (!Array.isArray(childrenNodes) || childrenNodes.length < 1) {
      return []
    }

    return makeSubRequirementsArray(childrenNodes)
  }

  /**
   * Return a data-only object with reduced fields for serialization
   * @returns {Object} A simplified JS object for serialization
   * @override
   */
  toJSON () {
    const JSONBase = super.toJSON()
    return {
      ...JSONBase,
      description: this.getDescription(),
      index: this.#programBodyIndex,
      nextIndex: this.#programBodyNextIndex
    }
  }
}
