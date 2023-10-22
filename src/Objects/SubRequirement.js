import { QUERIES, REGEX } from '../domTraversal/queriesAndRegex.js'
import Program from './Program.js'
import { abbreviate, makeKey, toTitleCase } from './abbreviator.js'

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
    this.headingRowNode = tableNode?.querySelector(QUERIES.subRequirementHeader)
    this.detailsRowNodes = Array.from(this.mainTableNode?.querySelectorAll(QUERIES.subRequirementDetails))
      ?.filter(row => row.textContent.trim() !== '')

    // Check that all the key nodes were found
    this.isValid = (this.mainTableNode && this.headingRowNode && Array.isArray(this.detailsRowNodes))
    if (!this.isValid) { return }

    // Set name and make a logger for this object
    this.name = abbreviate(toTitleCase(this.getHeading().trim()))
    this.key = makeKey(this.name)

    // Initialize derived values
    this.extractDescriptionText()
    this.extractUnits()
  }

  // Convert to string
  toString () {
    if (!this.isValid) { return 'Invalid Sub-Requirement' }
    return `${this.name}: ${this.satisfiedText} (${this.units.taken}/${this.units.req})`
  }

  /**
   * Examine the requirement to see if it is labeled as 'satisfied'
   * @returns {bool} Whether or not this requirement is satisfied
   */
  isSatisfied () {
    if (this.isValid && this.satisfiedText === 'Satisfied') {
      return Program.SATISFIED_TYPE.COMPLETE
    }

    return Program.SATISFIED_TYPE.INCOMPLETE
  }

  /**
   * Extract and return just the text of the requirement's header
   * @returns {string} The text within the requirement's header row
   */
  getHeading () {
    if (!this.isValid) { return '' }
    return this.headingRowNode.textContent
  }

  // Extract the descriptive text and satisfied status
  extractDescriptionText () {
    if (!this.isValid) { return }

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
      console.warn('Sub-Requirement Description regex failed')
      console.warn('------------------------')
      console.warn(this.name)
      console.warn('------------------------')
      console.warn(this.detailsRowNodes[0]
        ?.querySelector(QUERIES.subRequirementDescription)
        ?.textContent?.trim())
      console.warn('------------------------')
    }
  }

  // Find and extract the completion unit information
  extractUnits () {
    if (!this.isValid) { return }

    // Extract unit information
    this.units = this.mainTableNode.textContent.match(REGEX.subReqUnits)?.groups
    if (this.units) {
      this.units.req = parseFloat(this.units?.req)
      this.units.taken = parseFloat(this.units?.taken)
      this.units.need = parseFloat(this.units?.need)
    }
  }
}
