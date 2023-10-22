import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

import AuditNode from './AuditNode.js'

/**
 * An object for examining a sub-requirement within a program requirement
 */
export default class SubRequirement extends AuditNode {
  // References to DOM elements used for extraction of details
  #mainTableNode = null
  #headingRowNode = null
  #detailsRowNodes = null

  // Initialize derived values
  #satisfiedText = ''
  #description = ''
  #units = { req: 0, taken: 0, need: 0 }
  #isValid = false

  /**
   * Build a sub-requirement object from the TABLE node inside it's TR heading
   * @param {HTMLElement} tableNode The TR node that contains the top-level requirement's heading
   */
  constructor (tableNode) {
    super()

    // Save references to the key nodes for this requirement
    this.#mainTableNode = tableNode
    this.#headingRowNode = tableNode?.querySelector(QUERIES.subRequirementHeader)
    this.#detailsRowNodes = Array.from(this.#mainTableNode?.querySelectorAll(QUERIES.subRequirementDetails))
      ?.filter(row => row.textContent.trim() !== '')

    // Check that all the key nodes were found
    this.#isValid = (this.#mainTableNode && this.#headingRowNode && Array.isArray(this.#detailsRowNodes))
    if (!this.#isValid) { return }

    // No internal id so leave out parameters
    this._initialize()

    // Initialize derived values
    this._extractDescription()
    this._extractUnits()
  }

  // Accessors for private values
  getDescription () { return this.#description }
  getUnits () { return this.#units }
  isValid () { return this.#isValid }

  // Convert to string
  toString () {
    if (!this.#isValid) { return 'Invalid Sub-Requirement' }
    return `${this.getName()}: ${this.isSatisfied()} (${this.#units.taken}/${this.#units.req})`
  }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {
    if (this.#isValid && this.#satisfiedText === 'Satisfied') {
      return AuditNode.SATISFIED_TYPE.COMPLETE
    }

    return AuditNode.SATISFIED_TYPE.INCOMPLETE
  }

  /**
   * Extract and return just the text of the requirement's header
   * @returns {string} The text within the requirement's header row
   */
  _extractHeading () {
    if (!this.#isValid) { return '' }
    return this.#headingRowNode.textContent
  }

  // Extract the descriptive text and satisfied status
  _extractDescription () {
    if (!this.#isValid) { return }

    // Extract the description text
    const descriptionGroups = this.#detailsRowNodes[0]
      ?.querySelector(QUERIES.subRequirementDescription)
      ?.textContent.match(REGEX.subRequirementDescription)
      ?.groups

    // Parse out the groups
    if (descriptionGroups) {
      this.#satisfiedText = descriptionGroups.satisfied
      this.#description = descriptionGroups.description
    } else {
      console.warn('Sub-Requirement Description regex failed')
      console.warn('------------------------')
      console.warn(this.getName())
      console.warn(this.#mainTableNode)
      console.warn('------------------------')
    }
  }

  // Find and extract the completion unit information
  _extractUnits () {
    if (!this.#isValid) { return }

    // Extract unit information
    this.#units = this.#mainTableNode.textContent.match(REGEX.subReqUnits)?.groups
    if (this.#units) {
      this.#units.req = parseFloat(this.#units?.req)
      this.#units.taken = parseFloat(this.#units?.taken)
      this.#units.need = parseFloat(this.#units?.need)
    }
  }
}
