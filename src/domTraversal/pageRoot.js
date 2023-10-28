import { wait } from '../util/utilFunctions.js'
import { PAGE_IDS, QUERIES } from './queriesAndRegex.js'

// When waiting for programs to expand, how many times should we retry?
// NOTE: waits 1s between each try
const MAX_EXPAND_ALL_RETRIES = 10

// When waiting for audit page to load, how many times should we retry?
// NOTE: waits 1/10s between each try
const MAX_AUDIT_PAGE_WAIT = 1000

// Will be the root document after 'verifyRootDoc' is called
let auditRootDoc = null

// Convenience function to identify the audit page being loaded
export function isAuditPage () {
  return !!findPageElementInIframe(QUERIES.pageElement(PAGE_IDS.audit))
}

// Convenience function to identify the student center page being loaded
export function isStudentCenterPage () {
  return !!findPageElementInIframe(QUERIES.pageElement(PAGE_IDS.studentCenter))
}

// Find an element on the page (possibly searching the iframe document)
function findPageElementInIframe (queryString) {
  // Start looking at the global doc
  let rootDoc = document
  let pageElement = rootDoc.querySelector(queryString)
  if (!pageElement) {
    // Try looking inside the iframe
    rootDoc = document.querySelector('iframe')?.contentDocument
    pageElement = rootDoc.querySelector(queryString)
  }

  return pageElement
}

// Asynchronously navigate to the audit page (assumes we are on the student center page)
export async function navigateToAuditPage () {
  // Are we already on the audit page?
  if (verifyRootDoc()) { return }

  // Try to locate the "Other Academic" dropdown and go button
  const auditDropdown = findPageElementInIframe(QUERIES.otherAcademicDropdown)
  const goButton = findPageElementInIframe(QUERIES.otherAcademicGoButton)
  if (!auditDropdown || !goButton) {
    throw new Error('Failed to find "Other Academic" dropdown or "Go" button')
  }

  // Select the "Academic Requirements" option
  const index = Array.from(auditDropdown.options).findIndex(
    option => option.text.toLowerCase() === 'academic requirements')
  if (index === -1) {
    throw new Error('Failed to find "Academic Requirements" option')
  }
  auditDropdown.selectedIndex = index
  await wait(100)

  // Click the "Go" button
  goButton.click()

  // Wait for the page to load (can take a surprisingly long time)
  let tries = 0
  do {
    await wait(100)
  } while (!findPageElementInIframe(QUERIES.pageElement('SAA_SS_DPR_ADB')) && ++tries < MAX_AUDIT_PAGE_WAIT)

  if (!findPageElementInIframe(QUERIES.pageElement('SAA_SS_DPR_ADB'))) {
    throw new Error('Max retries exceeded waiting for audit page to load')
  }
}

// Identify the root document (may be in an iFrame)
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
  while (tries < MAX_EXPAND_ALL_RETRIES && getTopLevelExpanderList().length > 0) {
    await wait(1000)
    tries++
  }

  //  Did it work?
  if (getTopLevelExpanderList().length > 0) {
    throw new Error('Max retries exceeded waiting for program nodes to expand')
  }
}

export async function clickViewAllLinks () {
  // Get the Show All button
  const showButtons = Array.from(auditRootDoc.querySelectorAll(QUERIES.showButton))
  if (!Array.isArray(showButtons) || showButtons.length === 0) {
    console.log('Failed to find any "View All" buttons')
    return
  }

  // Click to initiate expansion
  for (let i = 0; i < showButtons.length; i++) {
    const showButton = showButtons[i]
    try {
      await clickAndWait(showButton)
    } catch (err) {
      console.error(err)
      console.log(showButton)
    }
  }
}

async function clickAndWait (showButton, curText = 'view all') {
  if (showButton.textContent.toLowerCase() === curText.toLowerCase()) {
    const buttonId = showButton.id

    let tries = 0
    let checkButton = null
    do {
      await wait(100)
      checkButton = auditRootDoc.getElementById(buttonId)
      if (tries % 10 === 0) {
        checkButton.click()
      }
      tries++
    } while (checkButton?.textContent.toLowerCase() === curText.toLowerCase() && tries < 40)

    if (checkButton.textContent.toLowerCase() === curText.toLowerCase()) {
      throw new Error(`Max retries exceeded waiting for "${curText.toLowerCase()} list to expand`)
    }
  } else {
    console.error(`\tExpected button text to be "${curText}" but found "${showButton.textContent}"`)
  }
}
