import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography } from '@mui/material'
import SummaryNode from './SummaryNode.jsx'

import Program from '../../Objects/Program.js'
import AuditSkeleton from './AuditSkeleton.jsx'

export default function StudentSummary (props) {
  const { programData, loadingStatus } = props

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

  if (!programData) {
    return (
      <React.Fragment>
        <Typography component='h1' variant='h6'>
          {loadingStatus ?? 'Loading ...'}
        </Typography>
        <Paper sx={{ overflowY: 'auto', height: 'calc(100% - 30px)' }} elevation={0}>
          <AuditSkeleton />
        </Paper>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Typography component='h1' variant='h6' gutterBottom>
        {`${programData?.studentName} Summary`}
      </Typography>
      <Paper sx={{ overflowY: 'auto', height: 'calc(100% - 30px)' }} elevation={0}>
        {generalSummaries}
        {universitySummaries}
        {programSummaries}
      </Paper>
    </React.Fragment>
  )
}

StudentSummary.propTypes = {
  programData: PropTypes.shape({
    studentName: PropTypes.string,
    generalNodes: PropTypes.arrayOf(PropTypes.instanceOf(Program)),
    universityNodes: PropTypes.arrayOf(PropTypes.instanceOf(Program)),
    programNodes: PropTypes.arrayOf(PropTypes.instanceOf(Program))
  }),
  loadingStatus: PropTypes.string
}

StudentSummary.defaultProps = {
  programData: {},
  loadingStatus: ''
}
