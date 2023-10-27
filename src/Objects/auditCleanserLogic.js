import { makeLogger } from '../util/logger.js'

// Document traversal functions and other DOM helpers
import { navigateToAuditPage, verifyRootDoc, expandAllSections, clickViewAllLinks, getRootDoc } from '../domTraversal/pageRoot.js'

// Factories for generating the core Program object
import { makeProgramArrays } from './NodeFactories.js'

// A high-visibility logger for the browser
const LOG = makeLogger('AUDIT_CLEANER', 'yellow', 'navy')

// Entry point for scanning the current page
export async function scanPageForPrograms () {
  // Ensure we are in the right place
  try {
    await navigateToAuditPage()
  } catch (err) {
    LOG.error('Failed to navigate to audit page')
    LOG.error(err)
    return
  }

  if (!verifyRootDoc()) {
    window.alert('Could not find "Expand All" button.\n\nAre you sure you are in an advising audit page?')
  } else {
    try {
      // Try to expand all the header nodes
      await expandAllSections()

      // Try to click all the 'show all' links
      await clickViewAllLinks()

      // Build and return all the programs and the student name
      return makeProgramArrays(getRootDoc())
    } catch (err) {
      LOG.error('Failed to retrieve/parse programs')
      LOG.error(err)
      return { studentName: 'error' }
    }
  }
}
