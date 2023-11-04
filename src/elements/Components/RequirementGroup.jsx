import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Collapse, List, ListItemButton } from '@mui/material'
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

import AuditNode from '../../Objects/AuditNode.js'

import RequirementItem from './RequirementItem.jsx'
import RequirementItemInfo from './RequirementItemInfo.jsx'

export default function RequirementGroup (props) {
  const { groupName, programKey, unitText, requirementNodes, first, last } = props

  const description = React.useMemo(() => {
    return `${requirementNodes.length} sub-requirements${unitText ? ` (${unitText})` : ''}`
  }, [requirementNodes, unitText])

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
        <RequirementItemInfo
          isSatisfied={groupSatisfied}
          name={groupName}
          description={description}
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
  unitText: PropTypes.string,
  first: PropTypes.bool,
  last: PropTypes.bool
}

RequirementGroup.defaultProps = {
  groupName: 'Unknown Group',
  programKey: 'missingProgramKey',
  unitText: '',
  requirementNodes: [],
  first: false,
  last: false
}
