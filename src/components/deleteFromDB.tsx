import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import {useAuth} from '../context/auth'
import DeleteConfirmationDialog from './deleteConfirmationDialog'

type DeleteFromDBPropType = {
  dialogLabelledBy: string
  dialogTitle: string
  dialogDeleting: string
  deleteFn: () => void
}

function DeleteFromDB({
  dialogTitle,
  deleteFn,
  dialogLabelledBy,
  dialogDeleting,
}: DeleteFromDBPropType) {
  const {user} = useAuth()
  const [showDialog, setShowDialog] = useState(false)

  if (!user) return <div />

  return (
    <>
      <Button
        aria-label="delete"
        size="small"
        onClick={() => setShowDialog(true)}
        variant="outlined"
        style={{padding: 0}}
      >
        <DeleteForeverIcon style={{fill: 'red', height: '33px'}} />
      </Button>
      <DeleteConfirmationDialog
        dialogTitle={dialogTitle}
        showDialog={showDialog}
        labelledBy={dialogLabelledBy}
        deleting={dialogDeleting}
        onReject={() => setShowDialog(false)}
        onAccept={() => {
          deleteFn()
          setShowDialog(false)
        }}
      />
    </>
  )
}

export default DeleteFromDB
