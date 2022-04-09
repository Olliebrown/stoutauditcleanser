import { makeLogger } from './util/logger.js'

// Document traversal functions and other DOM helpers
import { makeSummarizeButton } from './elements/summarizeButton.js'
import { getProgramNodes } from './domTraversal/programs.js'
import { getRootDoc, expandAllSections } from './domTraversal/pageRoot.js'

// Core data objects
import Program from './Objects/Program.js'

// A high-visibility logger for the browser
const LOG = makeLogger('AUDIT_CLEANER', 'yellow', 'navy')

// Entry point for scanning the current page
async function scanPage () {
  if (!getRootDoc()) {
    window.alert('Could not find "Expand All" button.\n\nAre you sure you are in an advising audit page?')
  } else {
    try {
      // Try to expand all the header nodes
      await expandAllSections()

      // Identify all the program nodes (degrees and minors)
      const programNodes = getProgramNodes()
      if (!Array.isArray(programNodes) || programNodes.length < 1) {
        LOG.error('Failed to find program nodes')
      } else {
        // Extract the main program requirements (for now, just the first one)
        const programs = programNodes.map((programNode) => new Program(programNode))
        LOG('Found the following programs')
        LOG(programs)
      }
    } catch (err) {
      LOG.error('Failed to retrieve programs')
      LOG.error(err)
    }
  }
}

// Add the 'summarize' button to the main overall document (not to iFrame)
const summaryDiv = makeSummarizeButton(() => { scanPage() })
summaryDiv.setAttribute('id', 'AUDIT_CLEANSER_BUTTON')
document.body.appendChild(summaryDiv)
