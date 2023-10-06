// Utility logger
import { makeLogger } from './util/logger.js'

// React root rendering support
import React from 'react'
import { createRoot } from 'react-dom/client'

// Document traversal functions and other DOM helpers
import { getProgramNodes } from './domTraversal/programs.js'
import { verifyRootDoc, expandAllSections, clickShowAllLinks } from './domTraversal/pageRoot.js'

// Key visible page elements
import { makeSummarizeButton } from './elements/summarizeButton.js'
import { makeCleanserContainer, makeRobotoFontTag } from './elements/reactAndMUIHelpers.js'
import CleanserRoot from './elements/Components/CleanserRoot.jsx'

// Core data objects
import Program from './Objects/Program.js'

// A high-visibility logger for the browser
const LOG = makeLogger('AUDIT_CLEANER', 'yellow', 'navy')

// Entry point for scanning the current page
async function scanPage () {
  if (!verifyRootDoc()) {
    window.alert('Could not find "Expand All" button.\n\nAre you sure you are in an advising audit page?')
  } else {
    try {
      // Try to expand all the header nodes
      await expandAllSections()

      // Try to click all the 'show all' links
      await clickShowAllLinks()

      // Identify all the university and program nodes
      const nodeGroups = getProgramNodes()

      // Output each group of nodes
      const titles = ['General Info', 'University Requirements', 'Programs']
      nodeGroups.forEach((nodeGroup, i) => {
        const groupTitle = titles[i]
        if (!Array.isArray(nodeGroup) || nodeGroup.length < 1) {
          LOG.error(`Failed to find ${groupTitle}`)
        } else {
          // Extract the rest as programs
          const nodePrograms = nodeGroup.map((node) => new Program(node))
          LOG(`Found the following ${groupTitle}`)
          nodePrograms.forEach(program => program.output())
        }
      })
    } catch (err) {
      LOG.error('Failed to retrieve/parse programs')
      LOG.error(err)
    }
  }
}

// Add React and MUI tags
const robotoFontTag = makeRobotoFontTag()
document.head.appendChild(robotoFontTag)

const appContainer = makeCleanserContainer()
document.body.appendChild(appContainer)

// Add the 'summarize' button to the main overall document (not to iFrame)
let showSummary = false
const summaryDiv = makeSummarizeButton(() => {
  if (!showSummary) {
    scanPage()
    appContainer.style.transform = 'translateX(0%)'
    showSummary = true
  } else {
    appContainer.style.transform = 'translateX(120%)'
    showSummary = false
  }
})
summaryDiv.setAttribute('id', 'AUDIT_CLEANSER_BUTTON')
document.body.appendChild(summaryDiv)

// Add the main react app
const reactAppRoot = createRoot(appContainer)
reactAppRoot.render(<CleanserRoot />)
