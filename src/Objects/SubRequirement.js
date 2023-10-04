import { makeLogger } from '../util/logger.js'
import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'

/**
 * An object for examining a sub-requirement within a program requirement
 */
export default class SubRequirement {
  /**
   * Build a sub-requirement object from the TABLE node inside it's TR heading
   * @param {HTMLElement} tableNode The TR node that contains the top-level requirement's heading
   */
  constructor (tableNode) {
    // Save references to the key nodes for this requirement
    this.mainTableNode = tableNode
    this.headingRowNode = tableNode.querySelector(QUERIES.subRequirementHeader)
    this.detailsRowNodes = Array.from(this.mainTableNode.querySelectorAll(QUERIES.subRequirementDetails))
      .filter(row => row.textContent.trim() !== '')

    // Set name and make a logger for this object
    this.name = this.getHeading().trim()
    this.LOG = makeLogger(`${this.name}`, 'lightblue', 'black', 1)

    // Initialize derived values
    this.extractDescriptionText()
    this.extractUnits()
    this.satisfied = this.isSatisfied()
  }

  output (labelLength = 0) {
    const padding = Math.max(labelLength - this.name.length, 0)
    if (this.satisfied) {
      this.LOG.green('%cSatisfied'.padStart(padding + 11, ' '))
    } else {
      this.LOG.red('%cNot Satisfied'.padStart(padding + 15, ' '))
    }
  }

  toString () {
    return `${this.name}: ${this.satisfiedText} (${this.units.taken}/${this.units.req})`
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
    const descriptionGroups = this.detailsRowNodes[0]
      ?.querySelector(QUERIES.subRequirementDescription)
      ?.textContent.match(REGEX.subRequirementDescription)
      ?.groups

    // Parse out the groups
    if (descriptionGroups) {
      this.satisfiedText = descriptionGroups.satisfied
      this.description = descriptionGroups.description
    } else {
      this.LOG.error('Description regex failed')
    }
  }

  extractUnits () {
    // Extract unit information
    this.units = this.mainTableNode.textContent.match(REGEX.subReqUnits)?.groups
    if (this.units) {
      this.units.req = parseFloat(this.units?.req)
      this.units.taken = parseFloat(this.units?.taken)
      this.units.need = parseFloat(this.units?.need)
    }
  }
}
