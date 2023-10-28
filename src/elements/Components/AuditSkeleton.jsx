import React from 'react'
import PropTypes from 'prop-types'

import { Skeleton } from '@mui/material'

export default function AuditSkeleton (props) {
  const { programCount, requirementCountMin, requirementCountMax } = props

  const [requirementCounts, setRequirementCounts] = React.useState([])
  React.useEffect(() => {
    const newCounts = []
    for (let i = 0; i < programCount; i++) {
      const randInRange = Math.floor(
        Math.random() * (requirementCountMax - requirementCountMin + 1)
      ) + requirementCountMin
      newCounts.push(Array(randInRange).fill())
    }
    setRequirementCounts(newCounts)
  }, [requirementCountMin, requirementCountMax, programCount])

  // Wait for the requirement counts to be generated
  if (requirementCounts.length !== programCount) {
    return null
  }

  return Array(programCount).fill().map((_, i) => (
    <React.Fragment key={i}>
      <Skeleton variant="text" sx={{ fontSize: '4rem' }} />
      {requirementCounts[i].map((_, j) => (
        <div
          key={j}
          style={{
            display: 'flex',
            width: '100%',
            marginBottom: (j === requirementCounts[i].length - 1 ? 0 : '5px')
          }}
        >
          <Skeleton
            variant="circular"
            sx={{ width: 40, height: 40, marginLeft: '5px' }}
          />
          <Skeleton
            variant="rectangular"
            sx={{ height: 40, width: 'calc(100% - 50px)', mx: '5px' }}
          />
        </div>
      ))}
    </React.Fragment>
  ))
}

AuditSkeleton.propTypes = {
  programCount: PropTypes.number,
  requirementCountMin: PropTypes.number,
  requirementCountMax: PropTypes.number
}

AuditSkeleton.defaultProps = {
  programCount: 3,
  requirementCountMin: 3,
  requirementCountMax: 5
}
