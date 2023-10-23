import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, List, ListSubheader } from '@mui/material'
import { Info as InfoIcon } from '@mui/icons-material'
import { grey } from '@mui/material/colors'

import Requirement from './Requirement.jsx'
import RequirementGroup from './RequirementGroup.jsx'

import Program from '../../Objects/Program.js'

export default function SummaryNode (props) {
  const { programNode } = props

  // Separate the GenEd requirements from the rest
  const genEdReqNodes = programNode.getSubNodes().filter((node) => node.isGenEd())
  const programReqNodes = programNode.getSubNodes().filter((node) => !node.isGenEd())

  return (
    <List
      dense={true}
      sx={{ paddingBottom: 0 }}
      subheader={
        <ListSubheader
          component="div"
          sx={{
            borderTop: '1px solid gray',
            borderBottom: '1px solid gray',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              maxWidth: '88%',
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              textOverflow: 'ellipsis'
            }}>
            {programNode.getName()}
          </span>
          <Tooltip title={programNode.getInternalId()}>
            <InfoIcon color={grey[100]} />
          </Tooltip>
        </ListSubheader>
      }
    >
      {genEdReqNodes.length > 0 &&
        <RequirementGroup
          groupName='General Education'
          programKey={programNode.getKey() + '_GenEd'}
          requirementNodes={genEdReqNodes}
          first
        />}
      {programReqNodes.map((req, i) => (
        <Requirement
          key={`${programNode.getKey()}_${i}`}
          programKey={programNode.getKey()}
          requirementNode={req}
          last={i === programNode.getSubNodes().length - 1}
        />
      ))}
    </List>
  )
}

SummaryNode.propTypes = {
  programNode: PropTypes.instanceOf(Program)
}
