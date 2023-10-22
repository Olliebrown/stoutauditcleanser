import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { grey } from '@mui/material/colors'
import { CheckCircle as CheckIcon, Dangerous as ErrorIcon, Warning as WarnIcon, Info as InfoIcon } from '@mui/icons-material'

import AuditNode from '../../Objects/AuditNode.js'
import Program from '../../Objects/Program.js'

export default function SummaryNode (props) {
  const { programNode } = props

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
    {programNode.getSubNodes().map((req, i) => (
      <ListItem
        key={`${programNode.getKey()}_${i}`}
        sx={{
          paddingTop: (i === 0 ? '12px' : undefined),
          paddingBottom: (i === programNode.getSubNodes().length - 1 ? '12px' : undefined)
        }}
      >
        <ListItemButton onClick={() => { req.scrollIntoView() }}>
          <Tooltip title={req.getInternalId()}>
            <ListItemIcon>
              {req.isSatisfied() === AuditNode.SATISFIED_TYPE.COMPLETE && <CheckIcon color='success' />}
              {req.isSatisfied() === AuditNode.SATISFIED_TYPE.IN_PROGRESS && <WarnIcon color='warning' />}
              {req.isSatisfied() === AuditNode.SATISFIED_TYPE.INCOMPLETE && <ErrorIcon color='error' />}
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            primaryTypographyProps={{
              sx: {
                whiteSpace: 'nowrap',
                overflowX: 'hidden',
                textOverflow: 'ellipsis'
              }
            }}
            primary={req.getName()}
          />
        </ListItemButton>
      </ListItem>
    ))}
    </List>
  )
}

SummaryNode.propTypes = {
  programNode: PropTypes.instanceOf(Program)
}
