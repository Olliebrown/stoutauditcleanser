import React from 'react'
import PropTypes from 'prop-types'

import { Paper, IconButton } from '@mui/material'
import { KeyboardDoubleArrowRight as HideIcon } from '@mui/icons-material'

import StudentSummary from './StudentSummary.jsx'

export default function CleanserRoot (props) {
  const { onHideSummary, showSummary, ...rest } = props

  return (
    <div
      style={{
        position: 'fixed',
        top: '90px',
        right: '10px',
        transform: showSummary ? 'translateX(0%)' : 'translateX(120%)',
        transition: 'transform 0.33s ease-in-out'
      }}
    >
      <Paper
        elevation={5}
        sx={{
          height: 'calc(100vh - 100px)',
          width: '45vw',
          padding: '20px'
        }}
      >
        <IconButton
          aria-label="hide summary"
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onHideSummary}
        >
          <HideIcon />
        </IconButton>
        <StudentSummary {...rest} />
      </Paper>
    </div>
  )
}

CleanserRoot.propTypes = {
  showSummary: PropTypes.bool,
  onHideSummary: PropTypes.func
}

CleanserRoot.defaultProps = {
  showSummary: false,
  onHideSummary: () => {}
}
