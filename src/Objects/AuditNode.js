// String helping functions
import { abbreviate, toTitleCase, makeKey } from './abbreviator.js'

// DOM traversal queries and regex
import { REGEX } from '../domTraversal/queriesAndRegex.js'

// Define common interface for all audit nodes
export default class AuditNode {
  // Internal values
  #name = 'UNKNOWN'
  #internalId = 'UNKNOWN_ID'
  #key = 'UNKNOWN_KEY'
  #subNodes = []
  #rootElement = null
  #units = {
    courses: null,
    credits: null,
    gpa: null
  }

  // Initialize important internal values in a consistent way
  _initialize (rootElement, keyRegex) {
    this.#rootElement = rootElement
    this.#name = abbreviate(toTitleCase(this._extractHeading().trim()))
    if (this.#rootElement && keyRegex instanceof RegExp) {
      this.#internalId = this.#rootElement.textContent?.match(keyRegex)?.[0] ?? 'UNKNOWN_ID'
    } else if (typeof keyRegex === 'string') {
      this.#internalId = keyRegex
    }

    this.#key = makeKey(this.#name)
    this.#subNodes = this._extractSubNodes()
    this.#units = this._extractUnits()
  }

  // Find and extract the completion unit information
  _extractUnits () {
    const units = {}

    // Extract unit information
    const credits = this._extractFullText().match(REGEX.credits)?.groups
    if (credits) {
      units.credits = {
        current: parseFloat(credits?.taken),
        required: parseFloat(credits?.req)
      }
    }

    // Extract course information
    const courses = this._extractFullText().match(REGEX.courses)?.groups
    if (courses) {
      units.courses = {
        current: parseFloat(courses?.taken),
        required: parseFloat(courses?.req)
      }
    }

    // Extract course information
    const gpa = this._extractFullText().match(REGEX.gpa)?.groups
    if (gpa) {
      units.gpa = {
        current: parseFloat(gpa?.actual),
        required: parseFloat(gpa?.req)
      }
    }

    return units
  }

  // Extract all the text of this node (including any sub-nodes)
  _extractFullText () {
    return this.#rootElement?.textContent.trim() ?? ''
  }

  // Abstract methods to be override by subclasses
  _extractHeading () { return 'BAD_HEADING' }
  _extractSubNodes () { return [] }

  // If there is a root element, scroll it into view (accounting for iFrame)
  scrollIntoView () {
    if (!this.#rootElement) { console.log('No root element'); return }
    const iFrame = document.querySelector('iframe')
    if (iFrame) {
      // console.log('Scrolling inside iFrame')
      // Need to get fresh reference to element to get correct position
      const childWithId = this.#rootElement.querySelector('[id]')
      const elementRect = iFrame.contentDocument.getElementById(childWithId.id).getBoundingClientRect()
      const scrollY = iFrame.contentWindow.scrollY
      iFrame.contentWindow.scrollTo({
        top: scrollY + elementRect.top - 10,
        behavior: 'smooth'
      })
    } else {
      console.log('Scrolling Normal')
      this.#rootElement.scrollIntoView()
    }
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

  // Default implementations (should be overridden by subclasses)
  toString () { return `${this.#name}: ${this.isSatisfied()}` }
  isSatisfied () { return AuditNode.SATISFIED_TYPE.UNKNOWN }

  /**
   * Return a data-only object with reduced fields for serialization
   * @returns {Object} A simplified JS object for serialization
   */
  toJSON () {
    return {
      name: this.getName(),
      key: this.getKey(),
      internalId: this.getInternalId(),
      isGenEd: this.isGenEd(),
      satisfied: this.isSatisfied(),
      units: this.getUnits(),
      subNodes: this.getSubNodes().map(subNode => subNode.toJSON())
    }
  }

  // Accessors for private values
  getName () { return this.#name }
  getInternalId () { return this.#internalId }
  getKey () { return this.#key }
  getSubNodes () { return this.#subNodes }
  getRootElement () { return this.#rootElement }
  getUnits () { return this.#units }
}

// Enum for requirement satisfaction status
AuditNode.SATISFIED_TYPE = Object.freeze({
  COMPLETE: 'COMPLETE',
  IN_PROGRESS: 'IN_PROGRESS',
  INCOMPLETE: 'INCOMPLETE',
  UNKNOWN: 'UNKNOWN'
})
