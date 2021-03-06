import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import styled from '@emotion/styled'
import {FormattedMessage} from 'react-intl'
import Button from '../button'

const $CloseBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -60px;
  margin-right: 4px;
`
function EditItem({children}: {children: React.ReactNode}) {
  const [showDialog, setShowDialog] = React.useState(false)
  const handleClose = () => {
    setShowDialog(!showDialog)
  }
  return (
    <>
      <Button
        onClick={() => setShowDialog(!showDialog)}
        type="button"
        aria-label="click to Edit Item"
        disabled={showDialog}
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
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
        <DialogTitle>
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </DialogTitle>
        <$CloseBtnWrapper>
          <Button
            type="button"
            data-testid="closeBtn"
            onClick={() => setShowDialog(!showDialog)}
          >
            <CloseIcon aria-label="click to close edit window" />
          </Button>
        </$CloseBtnWrapper>
        <DialogContent style={{padding: '20px'}}>{children}</DialogContent>
      </Dialog>
    </>
  )
}

export default EditItem
