import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@mui/material'
import SummaryNode from './SummaryNode.jsx'

export default function StudentSummary (props) {
  const { programData } = props

  // DEBUGGING
  console.log('Program Data:', programData)

  // Build the summary nodes for the general program data
  const generalSummaries = React.useMemo(() => {
    return programData?.generalNodes.map((node, i) =>
      <SummaryNode key={`generalSummary${i}`} programNode={node} />
    )
  }, [programData?.generalNodes])

  // Build the summary nodes for the university program data
  const universitySummaries = React.useMemo(() => {
    return programData?.universityNodes.map((node, i) =>
      <SummaryNode key={`univSummary${i}`} programNode={node} />
    )
  }, [programData?.universityNodes])

  // Build the summary nodes for the program program data
  const programSummaries = React.useMemo(() => {
    return programData?.programNodes.map((node, i) =>
      <SummaryNode key={`programSummary${i}`} programNode={node} />
    )
  }, [programData?.programNodes])

  return (
    <React.Fragment>
      <Typography variant='body'>
        {generalSummaries}
      </Typography>

      <Typography variant='body'>
        {universitySummaries}
      </Typography>

      <Typography variant='body'>
        {programSummaries}
      </Typography>
    </React.Fragment>
  )
}

StudentSummary.propTypes = {
  programData: PropTypes.object
}

StudentSummary.defaultProps = {
  programData: {}
}
