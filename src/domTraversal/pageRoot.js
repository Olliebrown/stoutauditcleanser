import { wait } from '../util/utilFunctions.js'
import { QUERIES } from './queriesAndRegex.js'

// When waiting for programs to expand, how many times should we retry?
const MAX_RETRIES = 10

export async function navigateToAuditPage () {
  // Are we already on the audit page?
  if (verifyRootDoc()) { return }

  // Start looking at the global doc
  let rootDoc = document
  let auditDropdown = rootDoc.querySelector(QUERIES.otherAcademicDropdown)
  if (!auditDropdown) {
    // Try looking inside the iframe
    rootDoc = document.querySelector('iframe')?.contentDocument
    auditDropdown = rootDoc.querySelector(QUERIES.otherAcademicDropdown)

    if (!auditDropdown) {
      throw new Error('Failed to find "Other Academic" dropdown')
    }
  }

  // Select the "Academic Requirements" option
  const index = Array.from(auditDropdown.options).findIndex(
    option => option.text.toLowerCase() === 'academic requirements')
  if (index === -1) {
    throw new Error('Failed to find "Academic Requirements" option')
  }
  auditDropdown.selectedIndex = index
  await wait(100)

  // Find and click the go button
  const goButton = rootDoc.querySelector(QUERIES.otherAcademicGoButton)
  if (!goButton) {
    throw new Error('Failed to find "Go" button')
  }
  goButton.click()

  // Wait for the page to load (can take a surprisingly long time)
  let tries = 0
  let pageElement = null
  do {
    await wait(100)
    pageElement = rootDoc.querySelector(QUERIES.pageElement('SAA_SS_DPR_ADB'))
  } while (!pageElement && tries++ < 1000)

  if (!pageElement) {
    throw new Error('Max retries exceeded waiting for audit page to load')
  }
}

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
    }
  }
}

async function clickAndWait (showButton, curText = 'view all') {
  if (showButton.textContent.toLowerCase() === curText.toLowerCase()) {
    const buttonId = showButton.id
    showButton.click()

    let tries = 0
    let checkButton = null
    do {
      await wait(100)
      checkButton = auditRootDoc.getElementById(buttonId)
      tries++
    } while (checkButton?.textContent.toLowerCase() === curText.toLowerCase() && tries < 100)

    if (checkButton.textContent.toLowerCase() === curText.toLowerCase()) {
      throw new Error(`Max retries exceeded waiting for "${curText.toLowerCase()} list to expand`)
    }
  } else {
    console.error(`\tExpected button text to be "${curText}" but found "${showButton.textContent}"`)
  }
}
