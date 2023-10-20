import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography } from '@mui/material'

import StudentSummary from './StudentSummary.jsx'

export default function CleanserRoot (props) {
  const { showSummary, ...rest } = props

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '40px',
        transform: showSummary ? 'translateX(0%)' : 'translateX(120%)',
        transition: 'transform 0.5s ease-in-out'
      }}
    >
      <Paper
        elevation={5}
        sx={{
          height: '55vh',
          width: '45vw',
          padding: '20px'
        }}>
        <Typography component='h1' variant='h5'>
          {'Audit Summary'}
        </Typography>
        <StudentSummary {...rest} />
      </Paper>
    </div>
  )
}

CleanserRoot.propTypes = {
  showSummary: PropTypes.bool
}

CleanserRoot.defaultProps = {
  showSummary: false
}
