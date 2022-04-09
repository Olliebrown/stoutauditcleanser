import { wait } from '../util/utilFunctions.js'
import { QUERIES } from './queriesAndRegex.js'

// When waiting for programs to expand, how many times should we retry?
const MAX_RETRIES = 10

// Identify the root document (may be in an iFrame)
let auditRootDoc = null
export function verifyRootDoc () {
  // First try just 'document'
  auditRootDoc = document
  let expanderButton = auditRootDoc.querySelector(QUERIES.expander)
  if (!expanderButton) {
    // Then, look inside the iframe
    const iFrame = document.querySelector('iframe')
    auditRootDoc = iFrame.contentDocument
    expanderButton = auditRootDoc.querySelector(QUERIES.expander)
  }

  // Did we find it?
  if (expanderButton !== null) {
    return auditRootDoc
  }

  // We didn't so clear it back to null and return null
  auditRootDoc = null
  return null
}

export function getRootDoc () {
  return auditRootDoc
}

// Get list of all collapsed, top-level expander links
function getTopLevelExpanderList () {
  return auditRootDoc.querySelectorAll(QUERIES.expanderList)
}

export async function expandAllSections () {
  // Get the Expand All button
  const expanderButton = auditRootDoc.querySelector(QUERIES.expander)
  if (!expanderButton) {
    throw new Error('Failed to find "Expand All" button')
  }

  // Click to initiate expansion
  expanderButton.click()

  // Wait until all are expanded
  let tries = 0
  while (tries < MAX_RETRIES && getTopLevelExpanderList().length > 0) {
    await wait(1000)
    tries++
  }

  //  Did it work?
  if (getTopLevelExpanderList().length > 0) {
    throw new Error('Max retries exceeded waiting for program nodes to expand')
  }
}
