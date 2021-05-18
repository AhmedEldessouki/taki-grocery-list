import React from 'react'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

function Spinner({
  mount,
  styling,
}: {
  mount: boolean
  styling?: React.CSSProperties
}) {
  return (
    <Fade
      in={true ?? mount}
      style={{position: 'absolute', color: 'green', ...styling}}
      unmountOnExit
    >
      <CircularProgress size={20} />
    </Fade>
  )
}

export default Spinner
