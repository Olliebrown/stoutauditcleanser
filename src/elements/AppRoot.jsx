import React from 'react'

import CleanserRoot from './Components/CleanserRoot.jsx'
import SummarizeButton from './Components/SummarizeButton.jsx'

import { scanPageForPrograms } from '../Objects/auditCleanserLogic.js'

import { CssBaseline } from '@mui/material'

import { usePageObserver } from './usePageObserver.js'
import { PAGE_IDS } from '../domTraversal/queriesAndRegex.js'

export default function AppRoot () {
  // Manage state of the summary dialog and button
  const [showSummary, setShowSummary] = React.useState(false)
  const onShowSummary = () => { setShowSummary(true) }
  const onHideSummary = () => { setShowSummary(false) }

  // Observe the 'page' element to determine if the summary button should be disabled
  const pageId = usePageObserver()

  // Load/reload the program data when the summary is shown
  const [programGroups, setProgramGroups] = React.useState(null)
  React.useEffect(() => {
    async function retrieveProgramData () {
      try {
        const newGroups = await scanPageForPrograms()
        setProgramGroups(newGroups)
      } catch (error) {
        console.error('Failed to read program data from page', error)
      }
    }

    // Run the program data retrieval if the summary is currently enabled
    if (showSummary) {
      setProgramGroups(null)
      retrieveProgramData()
    }
  }, [showSummary])

  // Only show the summary button on the audit and student center pages
  const disableShowButton = (
    pageId !== PAGE_IDS.audit &&
    pageId !== PAGE_IDS.studentCenter
  )

  // Determine the proper loading status message
  const statusMessage = (
    pageId !== PAGE_IDS.audit
      ? 'Loading Advising Audit ...'
      : 'Expanding all sections ...'
  )

  return (
    <React.Fragment>
      <CssBaseline />
      <CleanserRoot
        showSummary={showSummary}
        onHideSummary={onHideSummary}
        loadingStatus={statusMessage}
        programData={programGroups}
      />
      <SummarizeButton
        showButton={!disableShowButton && !showSummary}
        onClickCallback={onShowSummary}
      />
    </React.Fragment>
  )
}
