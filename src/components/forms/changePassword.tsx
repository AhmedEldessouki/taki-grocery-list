import React, {useEffect, useState} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import styled from '@emotion/styled'
import {FormattedMessage} from 'react-intl'
import {useAuth} from '../../context/auth'
import {$Warning} from '../../shared/utils'
import type {MyResponseType} from '../../../types/api'
import notify from '../../lib/notify'
import Spinner from '../spinner'
import ConfirmPassword from './confirmPassword'
import PasswordFields from './passwordFields'
import Button from '../button'

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

  useEffect(
    () => () => {
      setResponse({
        error: undefined,
        isSuccessful: false,
      })
    },
    [],
  )

  const handlePasswordUpdate = React.useCallback(
    async (e: React.SyntheticEvent) => {
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
          (err: Error) => {
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
        .catch((err: Error) => {
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
    },
    [user, userConfirmed],
  )

  return (
    <div style={{margin: '5px 22px 10px'}}>
      <Button
        type="button"
        onClick={() => setShowDialog(true)}
        aria-label="change password"
      >
        <FormattedMessage
          id="password.change"
          defaultMessage="Change Password"
        />
      </Button>
      <Dialog open={passwordDialog} aria-labelledby="change-password-dialog">
        <DialogTitle id="change-password-dialog">
          <FormattedMessage
            id="password.update"
            defaultMessage="Update Password"
          />
        </DialogTitle>
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
                color: 'var(--white)',
              }}
              bgColor="var(--green)"
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
                <FormattedMessage id="submit" defaultMessage="Submit" />
              )}
            </Button>
            <Button
              disabled={isPending}
              type="button"
              onClick={() => setPasswordDialog(false)}
            >
              <FormattedMessage id="close" defaultMessage="Close" />
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
