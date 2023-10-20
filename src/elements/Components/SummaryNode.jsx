import React from 'react'
import PropTypes from 'prop-types'

import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { Folder as FolderIcon } from '@mui/icons-material'

import Program from '../../Objects/Program.js'

export default function SummaryNode (props) {
  const { programNode } = props

  return (
    <List
      dense={true}
      subheader={
        <ListSubheader component="div">
          {programNode.getHeading()}
        </ListSubheader>
      }
    >
    {programNode.requirements.map((req, i) => (
      <ListItem key={programNode.getHeading() + i}>
        <ListItemIcon color={req.isSatisfied() ? 'success' : 'error'}><FolderIcon /></ListItemIcon>
        <ListItemText primary={req.getHeading()} />
      </ListItem>
    ))}
    </List>
  )
}

SummaryNode.propTypes = {
  programNode: PropTypes.objectOf(Program)
}
