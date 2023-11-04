import React from 'react'
import PropTypes from 'prop-types'

import RequirementGroup from './RequirementGroup.jsx'
import RequirementItem from './RequirementItem.jsx'

import AuditNode from '../../Objects/AuditNode.js'

export default function Requirement (props) {
  const { requirementNode, programKey, first, last } = props

  // Is this a group or just a single sub-requirement
  const isGroup = React.useMemo(() => {
    return requirementNode.getSubNodes().length > 1
  }, [requirementNode])

  if (isGroup) {
    return (
      <RequirementGroup
        groupName={requirementNode.getName()}
        programKey={`${programKey}_${requirementNode.getKey()}`}
        requirementNodes={requirementNode.getSubNodes()}
        unitText={requirementNode.unitsToString() ?? requirementNode.getSubNodes()[0]?.unitsToString()}
        first={first}
        last={last}
      />
    )
  } else {
    return (
      <RequirementItem
        requirementNode={requirementNode}
        description={requirementNode.getSubNodes()[0]?.toString()}
        first={first}
        last={last}
      />
    )
  }
}

Requirement.propTypes = {
  requirementNode: PropTypes.instanceOf(AuditNode).isRequired,
  programKey: PropTypes.string.isRequired,
  first: PropTypes.bool,
  last: PropTypes.bool
}

Requirement.defaultProps = {
  first: false,
  last: false
}
