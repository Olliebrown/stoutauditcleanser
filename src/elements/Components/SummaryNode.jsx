import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { grey } from '@mui/material/colors'
import { CheckCircle as CheckIcon, Dangerous as ErrorIcon, Warning as WarnIcon, Info as InfoIcon } from '@mui/icons-material'

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
            {programNode.name}
          </span>
          <Tooltip title={programNode.innerId}>
            <InfoIcon color={grey[100]} />
          </Tooltip>
        </ListSubheader>
      }
    >
    {programNode.requirements.map((req, i) => (
      <ListItem
        key={`${programNode.key}_${i}`}
        sx={{
          paddingTop: (i === 0 ? '12px' : undefined),
          paddingBottom: (i === programNode.requirements.length - 1 ? '12px' : undefined)
        }}
      >
        <Tooltip title={req.innerId}>
          <ListItemIcon>
            {req.isSatisfied() === Program.SATISFIED_TYPE.COMPLETE && <CheckIcon color='success' />}
            {req.isSatisfied() === Program.SATISFIED_TYPE.IN_PROGRESS && <WarnIcon color='warning' />}
            {req.isSatisfied() === Program.SATISFIED_TYPE.INCOMPLETE && <ErrorIcon color='error' />}
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
          primary={req.name}
        />
      </ListItem>
    ))}
    </List>
  )
}

SummaryNode.propTypes = {
  programNode: PropTypes.instanceOf(Program)
}
