import { makeLogger } from './logger.js'

const LOG = makeLogger('AUDIT_CLEANER', 'yellow', 'purple')
const MAX_RETRIES = 10

// Get list of header nodes for all major tables on page
function getProgramNodes () {
  const headerSelector = '[id*="DERIVED_SAA_DPR_GROUPBOX1GP"]'
  const headers = Array.from(document.querySelectorAll(headerSelector))

  // Extract the nodes that contain the program headers
  const generalRegEx = /(?:UNIVERSITY REQUIREMENTS)|(?:GENERAL INFORMATION)/i
  const programNodes = headers.filter((header) => (
    !header.textContent.match(generalRegEx))
  )

  return programNodes
}

async function getMainProgram (programNode) {
  // Expand main program if it is not already
  const expander = programNode.querySelector('a[aria-expanded=false]')
  if (expander) {
    LOG('Clicking expander')
    expander.click()
  }

  // Try several times to retrieve the proper node
  const programRoot = programNode.parentNode.parentNode.parentNode
  const descendIntoMadness = 'tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(5) > td:nth-child(2) tbody tbody'
  let tries = 0
  while (tries < MAX_RETRIES && programRoot.querySelector(descendIntoMadness) === null) {
    await wait(1000)
    tries++
  }

  // Did we get it?
  const mainTable = programRoot.querySelector(descendIntoMadness)
  if (!mainTable) {
    throw new Error('Max retries exceeded')
  } else {
    return mainTable
  }
}

// Generic function to wait
function wait (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, timeout)
  })
}

// Start primary function
async function main () {
  const programNodes = getProgramNodes()
  if (!Array.isArray(programNodes) || programNodes.length < 1) {
    LOG.error('Failed to find program nodes')
  } else {
    try {
      const mainProgram = await getMainProgram(programNodes[0])
      LOG('Main Program is', mainProgram)
    } catch (err) {
      LOG.error('Failed to retrieve main program', err)
    }
  }
}
main()
