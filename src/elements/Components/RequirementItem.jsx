import React from 'react'
import PropTypes from 'prop-types'

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { CheckCircle as CheckIcon, Dangerous as ErrorIcon, Warning as WarnIcon } from '@mui/icons-material'

import AuditNode from '../../Objects/AuditNode.js'

// Force the text to be on a single line and truncate with ellipsis when too wide
const ABBREVIATE_PROPS = {
  sx: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
  }
}

export default function RequirementItem (props) {
  const { requirementNode, description, first, last } = props

  return (
    <ListItemButton
      onClick={() => { requirementNode.scrollIntoView() }}
      sx={{
        paddingTop: (first ? '12px' : undefined),
        paddingBottom: (last ? '12px' : undefined)
      }}
    >
      <ListItemIcon>
        {requirementNode.isSatisfied() === AuditNode.SATISFIED_TYPE.COMPLETE && <CheckIcon color='success' />}
        {requirementNode.isSatisfied() === AuditNode.SATISFIED_TYPE.IN_PROGRESS && <WarnIcon color='warning' />}
        {requirementNode.isSatisfied() === AuditNode.SATISFIED_TYPE.INCOMPLETE && <ErrorIcon color='error' />}
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={ABBREVIATE_PROPS}
        secondaryTypographyProps={ABBREVIATE_PROPS}
        primary={requirementNode.getName()}
        secondary={description}
      />
    </ListItemButton>
  )
}

RequirementItem.propTypes = {
  requirementNode: PropTypes.instanceOf(AuditNode).isRequired,
  description: PropTypes.string,
  first: PropTypes.bool,
  last: PropTypes.bool
}

RequirementItem.defaultProps = {
  description: null,
  first: false,
  last: false
}
