import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {FormattedMessage} from 'react-intl'
import Spinner from './spinner'
import Button from './button'

type DeleteConfirmationDialogPropType = {
  DeletingMessage: JSX.Element
  DialogTitleCh: JSX.Element
  labelledBy: string
  showDialog: boolean
  onReject: () => void
  onAccept: () => void
}

function DeleteConfirmationDialog({
  DialogTitleCh,
  DeletingMessage,
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
      <DialogTitle id={labelledBy} style={{textTransform: 'capitalize'}}>
        {DialogTitleCh}
      </DialogTitle>
      <DialogContent>{DeletingMessage}</DialogContent>
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
          bgColor="var(--blue)"
          style={{
            color: 'var(--white)',
            width: '60px',
          }}
          onClick={onReject}
          aria-label="no"
        >
          <FormattedMessage id="no" defaultMessage="No" />
        </Button>
        <Button
          type="button"
          disabled={isPending}
          bgColor="var(--redTwo)"
          style={{color: 'var(--white)', width: '60px'}}
          onClick={() => {
            setPending(true)
            onAccept()
            setPending(false)
          }}
          aria-label="yes"
        >
          {isPending ? (
            <Spinner
              mount={isPending}
              size={28}
              styling={{
                position: 'relative',
                zIndex: 999999999999,
                color: 'var(--white)',
              }}
            />
          ) : (
            <FormattedMessage id="yes" defaultMessage="yes" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
