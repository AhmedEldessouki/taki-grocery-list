import React, {useState} from 'react'
import styled from '@emotion/styled'
import {IconButton} from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import {useAuth} from '../context/auth'
import DeleteConfirmationDialog from './deleteConfirmationDialog'

type DeleteFromDBPropType = {
  children: JSX.Element
  dialogLabelledBy: string
  dialogDeleting: string
  deleteFn: () => void
}

const $Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
`
const $ButtonWrapper = styled.div`
  position: relative;
  z-index: 100;
  bottom: 15px;
  left: -30px;
  width: 0;
  overflow: visible;
`

function DeleteFromDB({
  children,
  deleteFn,
  dialogLabelledBy,
  dialogDeleting,
}: DeleteFromDBPropType) {
  const {user} = useAuth()
  const [showDialog, setShowDialog] = useState(false)
  const [show, setShow] = useState(false)

  if (!user) return children

  return (
    <div style={{marginTop: '15px'}}>
      <$Container
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onDoubleClick={() => setShow(!show)}
      >
        <$ButtonWrapper>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => setShowDialog(true)}
          >
            <DeleteForeverIcon style={{fill: 'red'}} />
          </IconButton>
        </$ButtonWrapper>
        {children}
      </$Container>
      <DeleteConfirmationDialog
        showDialog={showDialog}
        labelledBy={dialogLabelledBy}
        deleting={dialogDeleting}
        onReject={() => setShowDialog(false)}
        onAccept={() => {
          deleteFn()
          setShowDialog(false)
        }}
      />
    </div>
  )
}

export default DeleteFromDB
