import React from 'react'
import PropTypes from 'prop-types'

import { ListItemButton } from '@mui/material'

import RequirementItemInfo from './RequirementItemInfo.jsx'
import AuditNode from '../../Objects/AuditNode.js'

export default function RequirementItem (props) {
  const { requirementNode, first, last } = props

  const description = React.useMemo(() => {
    const subNodes = requirementNode.getSubNodes()
    if (subNodes.length === 0) {
      return requirementNode.toString().substring(requirementNode.getName().length + 1)
    } else if (subNodes.length === 1) {
      const unitsString = requirementNode.unitsToString()
      return `${subNodes[0].toString()}${unitsString ? ` (${unitsString})` : ''}`
    } else {
      return `${subNodes.length} sub-requirements`
    }
  }, [requirementNode])

  return (
    <ListItemButton
      onClick={() => { requirementNode.scrollIntoView() }}
      sx={{
        paddingTop: (first ? '12px' : undefined),
        paddingBottom: (last ? '12px' : undefined)
      }}
    >
      <RequirementItemInfo
        isSatisfied={requirementNode.isSatisfied()}
        name={requirementNode.getName()}
        description={description}
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
