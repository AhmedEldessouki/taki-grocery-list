import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {MyResponseType} from '../../../types/api'
import {useAuth} from '../../context/auth'
import {$Warning} from '../../shared/utils'
import {$Field} from './sharedCss/field'

export default function ConfirmPassword({
  showDialog,
  onDialogClose,
  onDialogCancel,
  pendingStart,
  handleUserConfirmed,
}: {
  showDialog: boolean
  onDialogClose: () => void
  onDialogCancel: () => void
  pendingStart: () => void
  handleUserConfirmed: (arg: boolean) => void
}) {
  const {reauthenticateUser} = useAuth()
  const [isPending, setPending] = useState(false)
  const [responseST, setResponse] = useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  useEffect(() => {}, [])

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    const {currentPassword} = e.currentTarget as typeof e.currentTarget & {
      currentPassword: {value: string}
    }
    setPending(true)
    pendingStart()

    const response = await reauthenticateUser(currentPassword.value)
    if (response?.isSuccessful) {
      handleUserConfirmed(true)
      setResponse(() => ({...response}))
      onDialogClose()
    } else if (response?.error) {
      setResponse(() => ({...response}))
    }

    setPending(false)
  }
  if (!showDialog) return <div></div>
  return (
    <Dialog open={showDialog} aria-labelledby="confirm-password-dialog">
      <DialogTitle style={{paddingBottom: '0'}} id="confirm-password-dialog">
        Confirm Password
      </DialogTitle>
      <form onSubmit={handleSubmit} style={{width: '300px'}}>
        <DialogContent style={{paddingTop: '0'}}>
          <$Field>
            <input
              name="currentPassword"
              id="current-password"
              type="password"
              placeholder="Enter password"
              minLength={6}
              required
              onFocus={() => {
                if (responseST.error) {
                  setResponse({isSuccessful: undefined, error: undefined})
                }
              }}
            />
            <label htmlFor="current-password">Current Password</label>
          </$Field>
          {responseST.error && (
            <$Warning role="alert" marginBottom="10px">
              {responseST.error.message}
            </$Warning>
          )}
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: 'space-evenly',
            paddingBottom: '25px',
            minWidth: '50%',
          }}
        >
          <Button
            type="submit"
            variant="contained"
            style={{
              background: !isPending ? 'var(--green)' : 'var(--red)',
              color: 'var(--lightGray)',
            }}
            disabled={isPending}
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              setResponse({error: undefined, isSuccessful: false})
              onDialogCancel()
            }}
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
