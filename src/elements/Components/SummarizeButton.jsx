import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@mui/material'

export default function SummarizeButton (props) {
  const { onClickCallback, showButton } = props

  return (
    <div style={{
      position: 'fixed',
      top: '150px',
      right: (showButton ? '-45px' : '-80px'),
      transform: 'rotate(-90deg)',
      transition: 'right 0.33s ease-in-out'
    }}>
      <Button
        onClick={onClickCallback}
        variant='contained'
        color='primary'
        >
        {'Summarize'}
      </Button>
    </div>
  )
}

SummarizeButton.propTypes = {
  onClickCallback: PropTypes.func,
  showButton: PropTypes.bool
}

SummarizeButton.defaultProps = {
  onClickCallback: () => {},
  showButton: true
}
