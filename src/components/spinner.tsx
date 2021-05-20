import React from 'react'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

function Spinner({
  mount,
  size,
  styling,
}: {
  mount: boolean
  size?: number
  styling?: React.CSSProperties
}) {
  return (
    <Fade
      in={mount}
      style={{
        position: 'absolute',
        color: 'var(--green)',
        ...styling,
      }}
      unmountOnExit
    >
      <CircularProgress size={size ?? 20} />
    </Fade>
  )
}

export default Spinner
