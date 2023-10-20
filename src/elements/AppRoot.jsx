import React from 'react'

import CleanserRoot from './Components/CleanserRoot.jsx'
import SummarizeButton from './Components/SummarizeButton.jsx'

import { scanPageForPrograms } from '../Objects/auditCleanserLogic.js'

import { CssBaseline } from '@mui/material'

export default function AppRoot () {
  const [showSummary, setShowSummary] = React.useState(false)
  const toggleSummary = () => {
    setShowSummary(!showSummary)
  }

  const [programGroups, setProgramGroups] = React.useState(null)
  React.useEffect(() => {
    async function retrieveProgramData () {
      const newGroups = await scanPageForPrograms()
      setProgramGroups(newGroups)
    }

    if (showSummary) {
      retrieveProgramData()
    }
  }, [showSummary])

  return (
    <React.Fragment>
      <CssBaseline />
      <CleanserRoot showSummary={showSummary} programData={programGroups} />
      <SummarizeButton onClickCallback={toggleSummary} />
    </React.Fragment>
  )
}
