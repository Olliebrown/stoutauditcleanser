import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@mui/material'

export default function SummarizeButton (props) {
  const { onClickCallback } = props

  return (
    <div style={{
      position: 'fixed',
      bottom: '-4px',
      right: '20px'
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
  onClickCallback: PropTypes.func
}

SummarizeButton.defaultProps = {
  onClickCallback: () => {}
}
