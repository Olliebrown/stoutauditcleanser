import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

import AuditNode from './AuditNode.js'
import { makeRequirementsArray, makeSubRequirementsArray } from './NodeFactories.js'

/**
 * An object for examining a program or sub-program and its requirements
 */
export default class Program extends AuditNode {
  // References to DOM elements used for extraction of details
  #programHeaderNode = null
  #programRoot = null
  #mainTable = null

  constructor (programHeaderNode) {
    // Required call to parent constructor
    super()

    // Initialize important members used for extraction below
    this.#programHeaderNode = programHeaderNode
    this.#programRoot = programHeaderNode.parentNode.parentNode.parentNode

    // Try to find the main program table
    this.#mainTable = this.#programRoot.querySelector(QUERIES.programTable(5))
    if (!this.#mainTable) {
      // Try reduced depth
      this.#mainTable = this.#programRoot.querySelector(QUERIES.programTable(3))
      if (!this.#mainTable) {
        throw new Error('Failed to find program table')
      }
    }

    // Initialize internal values
    this._initialize(this.#programRoot, /RG-\d+/)
  }

  /**
   * Extract and return just the text of the program's header
   * @returns {string} The text within the program's header row
   * @override
   */
  _extractHeading () {
    return this.#programHeaderNode.textContent
  }

  // Find and extract the completion unit information
  _extractFullText () {
    const descriptionText = this.#programRoot.querySelector(QUERIES.programTable(3))?.textContent
    if (descriptionText?.match(REGEX.units)) {
      return descriptionText
    }

    return super._extractFullText()
  }

  /**
   * Extract the requirements and convert them to an array of Requirement objects
   * @returns {Array(Requirement)} Array of Requirement objects extracted from the HTML
   * @override
   */
  _extractSubNodes () {
    // Try to extract as Requirements
    let requirements = makeRequirementsArray(this.#mainTable)
    if (!Array.isArray(requirements) || requirements.length < 1) {
      // Try sub-requirements instead
      requirements = makeSubRequirementsArray(this.#mainTable)
    }
    return requirements
  }

  /**
   * If all requirements are satisfied, then this is considered satisfied
   * @returns {bool} Weather or not this program is satisfied (e.g. completed)
   * @override
   */
  isSatisfied () {
    const requirements = this.getSubNodes()

    // Something is wrong so just return incomplete
    if (!Array.isArray(requirements) || requirements.length < 1) {
      return AuditNode.SATISFIED_TYPE.INCOMPLETE
    }

    // Check each requirement
    return requirements.reduce((complete, requirement) => {
      switch (complete) {
        // Once we have an incomplete, we can't go back
        case AuditNode.SATISFIED_TYPE.INCOMPLETE:
          return AuditNode.SATISFIED_TYPE.INCOMPLETE

        // Never return to 'complete' status once we are in-progress
        case AuditNode.SATISFIED_TYPE.IN_PROGRESS:
          if (requirement.isSatisfied() === AuditNode.SATISFIED_TYPE.COMPLETE) {
            return AuditNode.SATISFIED_TYPE.IN_PROGRESS
          }
      }

      // Otherwise, just return the status of the current requirement
      return requirement.isSatisfied()
    }, AuditNode.SATISFIED_TYPE.COMPLETE)
  }
}
