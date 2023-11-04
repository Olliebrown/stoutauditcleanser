import React from 'react'
import PropTypes from 'prop-types'

import { ListItemIcon, ListItemText } from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Dangerous as ErrorIcon,
  Warning as WarnIcon,
  Help as UnknownIcon
} from '@mui/icons-material'

import AuditNode from '../../Objects/AuditNode.js'

// Force the text to be on a single line and truncate with ellipsis when too wide
const ABBREVIATE_PROPS = {
  sx: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
  }
}

export default function RequirementItemInfo (props) {
  const { isSatisfied, name, description } = props

  return (
    <React.Fragment>
      <ListItemIcon>
        {isSatisfied === AuditNode.SATISFIED_TYPE.COMPLETE && <CheckIcon color='success' />}
        {isSatisfied === AuditNode.SATISFIED_TYPE.IN_PROGRESS && <WarnIcon color='warning' />}
        {isSatisfied === AuditNode.SATISFIED_TYPE.INCOMPLETE && <ErrorIcon color='error' />}
        {isSatisfied === AuditNode.SATISFIED_TYPE.UNKNOWN && <UnknownIcon />}
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={ABBREVIATE_PROPS}
        secondaryTypographyProps={ABBREVIATE_PROPS}
        primary={name}
        secondary={description}
      />
    </React.Fragment>
  )
}

RequirementItemInfo.propTypes = {
  isSatisfied: PropTypes.oneOf(Object.values(AuditNode)),
  name: PropTypes.string,
  description: PropTypes.string
}

RequirementItemInfo.defaultProps = {
  isSatisfied: AuditNode.SATISFIED_TYPE.UNKNOWN,
  name: 'Unknown Requirement',
  description: ''
}
