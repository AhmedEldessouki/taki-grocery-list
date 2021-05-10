import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import styled from '@emotion/styled'
import {useAuth} from '../../context/auth'
import {$Warning} from '../../shared/utils'
import type {MyResponseType} from '../../../types/api'
import {notify} from '../../lib/notify'
import ConfirmPassword from './confirmPassword'
import PasswordFields from './passwordFields'

const $Form = styled.form`
  width: 320px;
  li {
    font-size: 17px !important;
  }
`
function ChangePassword() {
  const {user} = useAuth()
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [userConfirmed, setUserConfirmed] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>()
  const [isPending, setPending] = useState<boolean>()
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)
  const [responseST, setResponse] = useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  useEffect(() => {
    return () => {
      setResponse({
        error: undefined,
        isSuccessful: false,
      })
    }
  }, [])

  async function handlePasswordUpdate(e: React.SyntheticEvent) {
    e.preventDefault()
    setResponse({error: undefined, isSuccessful: false})
    let status: string = 'idle'
    const {password} = e.currentTarget as typeof e.currentTarget & {
      password: {value: string}
    }
    if (!userConfirmed) return 'unChanged'
    setPending(true)

    await user
      ?.updatePassword(password.value)
      .then(
        () => {
          notify('✔', `Password Updated!`, {
            color: 'var(--green)',
          })
          setResponse({error: undefined, isSuccessful: true})
          status = 'resolved'
          setPasswordDialog(false)
        },
        err => {
          notify('❌', `Update Failed!`, {
            color: 'var(--red)',
          })
          setResponse({isSuccessful: false, error: err})
          status = 'rejected'
          if (err.message === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN') {
            setUserConfirmed(false)
          }
        },
      )
      .catch(err => {
        notify('❌', `Update Failed!`, {
          color: 'var(--red)',
        })
        setResponse({isSuccessful: false, error: err})
        status = 'rejected'
        if (err.message === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN') {
          setUserConfirmed(false)
        }
      })

    setPending(false)
    return status
  }

  return (
    <div style={{margin: '5px 22px 10px'}}>
      <Button
        type="button"
        variant="contained"
        onClick={() => setShowDialog(true)}
        aria-label="change password"
      >
        Change Password
      </Button>
      <Dialog open={passwordDialog} aria-labelledby="change-password-dialog">
        <DialogTitle id="change-password-dialog">Delete Account</DialogTitle>
        <$Form id="change-password" onSubmit={handlePasswordUpdate}>
          <DialogContent style={{paddingTop: '0'}}>
            <PasswordFields setIsPasswordConfirmed={setIsPasswordConfirmed} />
          </DialogContent>
          {responseST.error && (
            <$Warning role="alert" marginBottom="10px">
              {responseST.error.message}
            </$Warning>
          )}
          <DialogActions
            style={{
              justifyContent: 'space-evenly',
              paddingBottom: '10px',
              minWidth: '50%',
            }}
          >
            <Button
              disabled={isPending ?? !isPasswordConfirmed}
              type="submit"
              style={{
                background: !isPending ? 'var(--green)' : 'var(--red)',
                color: 'var(--lightGray)',
              }}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
            <Button
              disabled={isPending ?? !isPasswordConfirmed}
              type="button"
              variant="contained"
              onClick={() => setPasswordDialog(false)}
            >
              Close
            </Button>
          </DialogActions>
        </$Form>
      </Dialog>
      <ConfirmPassword
        showDialog={!!showDialog}
        pendingStart={() => {}}
        handleUserConfirmed={arg => setUserConfirmed(arg)}
        onDialogClose={() => {
          setPasswordDialog(true)
          setShowDialog(false)
        }}
        onDialogCancel={() => {
          setShowDialog(false)
        }}
      />
    </div>
  )
}

export default ChangePassword
