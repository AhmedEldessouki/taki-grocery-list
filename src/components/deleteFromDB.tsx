import React, {useState} from 'react'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import {useAuth} from '../context/auth'
import DeleteConfirmationDialog from './deleteConfirmationDialog'
import Button from './button'

type DeleteFromDBPropType = {
  dialogLabelledBy: string
  DialogTitle: JSX.Element
  DeletingMessage: JSX.Element
  deleteFn: () => void
}

function DeleteFromDB({
  DialogTitle,
  deleteFn,
  dialogLabelledBy,
  DeletingMessage,
}: DeleteFromDBPropType) {
  const {user} = useAuth()
  const [showDialog, setShowDialog] = useState(false)

  if (!user) return <div />

  return (
    <>
      <Button
        type="button"
        aria-label="delete"
        onClick={() => setShowDialog(true)}
        style={{
          padding: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <DeleteForeverIcon style={{fill: 'red', height: '33px'}} />
      </Button>
      <DeleteConfirmationDialog
        DialogTitleCh={DialogTitle}
        showDialog={showDialog}
        labelledBy={dialogLabelledBy}
        DeletingMessage={DeletingMessage}
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
