import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

type DeleteConfirmationDialogPropType = {
  deleting: string
  labelledBy: string
  showDialog: boolean
  onReject: () => void
  onAccept: () => void
}

function DeleteConfirmationDialog({
  deleting,
  labelledBy,
  showDialog,
  onReject,
  onAccept,
}: DeleteConfirmationDialogPropType) {
  const [isPending, setPending] = React.useState(false)
  const handleClose = () => {
    if (isPending) return
    onReject()
  }
  return (
    <Dialog
      open={showDialog}
      onClose={handleClose}
      aria-labelledby={labelledBy}
    >
      <DialogTitle id={labelledBy}>Delete Account</DialogTitle>
      <DialogContent>
        <span>Do you want to delete {deleting}?</span>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'space-evenly',
          padding: ' 25px 0',
          minWidth: '50%',
        }}
      >
        <Button
          type="button"
          disabled={isPending}
          variant="contained"
          color="primary"
          onClick={onReject}
          aria-label="no"
        >
          No
        </Button>
        <Button
          type="button"
          disabled={isPending}
          variant="contained"
          color="secondary"
          onClick={() => {
            setPending(true)
            onAccept()
            setPending(false)
          }}
          aria-label="yes"
        >
          yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
