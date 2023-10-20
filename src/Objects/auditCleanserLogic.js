import { makeLogger } from '../util/logger.js'

// Document traversal functions and other DOM helpers
import { getProgramNodes } from '../domTraversal/programs.js'
import { navigateToAuditPage, verifyRootDoc, expandAllSections, clickViewAllLinks } from '../domTraversal/pageRoot.js'

// Core data object
import Program from './Program.js'

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

      // Identify the various node elements
      const nodeGroups = getProgramNodes()

      // Convert the node elements into Program objects and return
      return {
        generalNodes: nodeGroups[0]?.map(node => new Program(node)),
        universityNodes: nodeGroups[1]?.map(node => new Program(node)),
        programNodes: nodeGroups[2]?.map(node => new Program(node))
      }
    } catch (err) {
      LOG.error('Failed to retrieve/parse programs')
      LOG.error(err)
    }
  }
}
