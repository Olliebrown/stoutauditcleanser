// String helping functions
import { abbreviate, toTitleCase, makeKey } from './abbreviator.js'

// Define common interface for all audit nodes
export default class AuditNode {
  // Internal values
  #name = 'UNKNOWN'
  #internalId = 'UNKNOWN_ID'
  #key = 'UNKNOWN_KEY'
  #subNodes = []
  #rootElement = null

  // Initialize important internal values in a consistent way
  _initialize (rootElement, keyRegex) {
    this.#rootElement = rootElement
    this.#name = abbreviate(toTitleCase(this._extractHeading().trim()))
    if (this.#rootElement && keyRegex) {
      this.#internalId = this.#rootElement.textContent?.match(keyRegex)?.[0] ?? 'UNKNOWN_ID'
    }

    this.#key = makeKey(this.#name)
    this.#subNodes = this._extractSubNodes()
  }

  // Abstract methods to be override by subclasses
  _extractHeading () { return 'BAD_HEADING' }
  _extractSubNodes () { return [] }

  // If there is a root element, scroll it into view (accounting for iFrame)
  scrollIntoView () {
    if (!this.#rootElement) { console.log('No root element'); return }
    const iFrame = document.querySelector('iframe')
    if (iFrame) {
      console.log('Scrolling inside iFrame')
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

  // Default implementations (should be overridden by subclasses)
  toString () { return `${this.#name}: ${this.isSatisfied()}` }
  isSatisfied () { return AuditNode.SATISFIED_TYPE.UNKNOWN }

  // Accessors for private values
  getName () { return this.#name }
  getInternalId () { return this.#internalId }
  getKey () { return this.#key }
  getSubNodes () { return this.#subNodes }
  getRootElement () { return this.#rootElement }
}

// Enum for requirement satisfaction status
AuditNode.SATISFIED_TYPE = Object.freeze({
  COMPLETE: 'COMPLETE',
  IN_PROGRESS: 'IN_PROGRESS',
  INCOMPLETE: 'INCOMPLETE',
  UNKNOWN: 'UNKNOWN'
})
