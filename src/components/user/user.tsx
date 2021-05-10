import React from 'react'
import Button from '@material-ui/core/Button'

import Profile from './profile'

function User() {
  const [showDialog, setShowDialog] = React.useState(false)

  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)

  return (
    <div style={{margin: '10px auto'}}>
      <Button
        onClick={() => {
          openDialog()
        }}
        variant="contained"
      >
        Profile
      </Button>
      {showDialog && (
        <Profile showDialog={showDialog} closeDialog={closeDialog} />
      )}
    </div>
  )
}
export default User
