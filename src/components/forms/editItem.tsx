import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'

function EditItem({children}: {children: React.ReactNode}) {
  const [showDialog, setShowDialog] = React.useState(false)
  const handleClose = () => {
    setShowDialog(!showDialog)
  }
  return (
    <>
      <Button
        style={{width: '50px', marginRight: '10px'}}
        onClick={() => setShowDialog(!showDialog)}
        variant="outlined"
        disabled={showDialog}
      >
        <EditIcon
          aria-label="edit item"
          style={{color: 'var(--blue)', height: '29px'}}
        />
      </Button>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="Edit List Item"
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent style={{padding: '20px'}}>{children}</DialogContent>
      </Dialog>
    </>
  )
}

export default EditItem
