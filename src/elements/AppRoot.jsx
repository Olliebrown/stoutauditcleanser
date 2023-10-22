import React from 'react'

import CleanserRoot from './Components/CleanserRoot.jsx'
import SummarizeButton from './Components/SummarizeButton.jsx'

import { scanPageForPrograms } from '../Objects/auditCleanserLogic.js'

import { CssBaseline } from '@mui/material'

export default function AppRoot () {
  const [showSummary, setShowSummary] = React.useState(false)
  const onShowSummary = () => {
    setShowSummary(true)
  }

  const onHideSummary = () => {
    setShowSummary(false)
  }

  const [programGroups, setProgramGroups] = React.useState(null)
  React.useEffect(() => {
    async function retrieveProgramData () {
      const newGroups = await scanPageForPrograms()
      setProgramGroups(newGroups)
    }

    if (showSummary) {
      setProgramGroups(null)
      retrieveProgramData()
    }
  }, [showSummary])

  return (
    <React.Fragment>
      <CssBaseline />
      <CleanserRoot showSummary={showSummary} onHideSummary={onHideSummary} programData={programGroups} />
      <SummarizeButton showButton={!showSummary} onClickCallback={onShowSummary} />
    </React.Fragment>
  )
}
