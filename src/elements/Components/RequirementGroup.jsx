import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Dangerous as ErrorIcon,
  Warning as WarnIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'

import AuditNode from '../../Objects/AuditNode.js'

import RequirementItem from './RequirementItem.jsx'

export default function RequirementGroup (props) {
  const { groupName, programKey, requirementNodes, first, last } = props

  // Is the collapse open or closed?
  const [showDetails, setShowDetails] = React.useState(false)

  // Determine the overall satisfied status of the requirement group
  const groupSatisfied = React.useMemo(() => {
    const satisfied = requirementNodes.map((node) => node.isSatisfied())
    if (satisfied.includes(AuditNode.SATISFIED_TYPE.INCOMPLETE)) {
      return AuditNode.SATISFIED_TYPE.INCOMPLETE
    }

    if (satisfied.includes(AuditNode.SATISFIED_TYPE.IN_PROGRESS)) {
      return AuditNode.SATISFIED_TYPE.IN_PROGRESS
    }

    return AuditNode.SATISFIED_TYPE.COMPLETE
  }, [requirementNodes])

  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => { setShowDetails(!showDetails) }}
        sx={{
          paddingTop: (first ? '12px' : undefined),
          paddingBottom: (last ? '12px' : undefined)
        }}
      >
        <ListItemIcon>
          {groupSatisfied === AuditNode.SATISFIED_TYPE.COMPLETE && <CheckIcon color='success' />}
          {groupSatisfied === AuditNode.SATISFIED_TYPE.IN_PROGRESS && <WarnIcon color='warning' />}
          {groupSatisfied === AuditNode.SATISFIED_TYPE.INCOMPLETE && <ErrorIcon color='error' />}
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            sx: {
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              textOverflow: 'ellipsis'
            }
          }}
          primary={groupName}
        />
        {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={showDetails}>
        <Paper elevation={3} sx={{ mx: '10px', mb: '5px' }}>
          <List component='div' dense disablePadding>
            {requirementNodes.map((requirementNode, i) => (
              <RequirementItem
                key={`${programKey}_${i}`}
                requirementNode={requirementNode}
                first={i === 0}
                last={i === requirementNodes.length - 1}
              />
            ))}
          </List>
        </Paper>
      </Collapse>
    </React.Fragment>
  )
}

RequirementGroup.propTypes = {
  requirementNodes: PropTypes.arrayOf(PropTypes.instanceOf(AuditNode)),
  programKey: PropTypes.string,
  groupName: PropTypes.string,
  first: PropTypes.bool,
  last: PropTypes.bool
}

RequirementGroup.defaultProps = {
  groupName: 'unknown group',
  programKey: 'missingProgramKey',
  requirementNodes: [],
  first: false,
  last: false
}
