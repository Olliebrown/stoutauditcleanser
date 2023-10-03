import React from 'react'
import PropTypes from 'prop-types'

import { CssBaseline, Paper, Typography } from '@mui/material'

import StudentSummary from './StudentSummary.jsx'

export default function CleanserRoot (props) {
  const { showSummary, ...rest } = props

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper
        elevation={5}
        sx={{
          height: '45vh',
          width: '33vw',
          padding: '20px'
        }}>
        <Typography component='h1' variant='h5'>
          {'Audit Summary'}
        </Typography>
        <StudentSummary {...rest} />
      </Paper>
    </React.Fragment>
  )
}

CleanserRoot.propTypes = {
  showSummary: PropTypes.bool
}

CleanserRoot.defaultProps = {
  showSummary: false
}
