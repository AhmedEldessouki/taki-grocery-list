import React, {useState} from 'react'
import styled from '@emotion/styled'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {$Warning, $Success, mqMax} from '../../shared/utils'
import {auth} from '../../lib/firebase'
import Spinner from '../spinner'
import $Field from './sharedCss/field'
import Button from '../button'

const $TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  span {
    margin-bottom: 10px !important;
  }
`
const $Form = styled.form`
  width: 300px;
  ${mqMax.xs} {
    width: 250px;
  }
`

function ForgetPassword({onCancel}: {onCancel: () => void}) {
  const [passwordRecoveryFailed, setPasswordRecoveryFailed] = useState<string>()
  const [passwordRecoverySuccessful, setPasswordRecoverySuccessful] =
    useState<string>()
  const [isPending, setPending] = useState(false)

  const handleForgetPassword = React.useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setPending(!isPending)

      const {signInEmail} = e.target as typeof e.target & {
        signInEmail: {value: string}
      }

      await auth
        .sendPasswordResetEmail(signInEmail.value)
        .then(
          () => {
            setPasswordRecoveryFailed(undefined)
            setPasswordRecoverySuccessful(
              'Please check your email. You may find it in junk.',
            )
          },
          err => {
            setPasswordRecoverySuccessful(undefined)
            setPasswordRecoveryFailed(err.message as string)
          },
        )
        .catch(err => {
          setPasswordRecoverySuccessful(undefined)
          setPasswordRecoveryFailed(err.message as string)
        })
      setPending(false)
    },
    [isPending],
  )

  return (
    <div>
      <DialogTitle style={{paddingBottom: '0'}} id="sign-in-dialog">
        Forget Password
      </DialogTitle>
      <$Form onSubmit={handleForgetPassword} style={{overflow: 'hidden'}}>
        <DialogContent style={{paddingTop: '0'}}>
          <$Field>
            <input
              name="signInEmail"
              id="signInEmail"
              placeholder="Enter email"
              type="email"
              required
            />
            <label htmlFor="signInEmail">Email</label>
          </$Field>
        </DialogContent>
        <$TextWrapper>
          {passwordRecoveryFailed && (
            <$Warning role="alert"> {passwordRecoveryFailed} </$Warning>
          )}
          {passwordRecoverySuccessful && (
            <$Success role="alert"> {passwordRecoverySuccessful} </$Success>
          )}
        </$TextWrapper>
        <DialogActions
          style={{
            justifyContent: 'space-evenly',
            paddingBottom: '25px',
            minWidth: '50%',
          }}
        >
          <Button
            type="submit"
            style={{
              background: 'var(--green)',
              color: 'var(--white)',
            }}
            disabled={isPending}
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
              'Submit'
            )}
          </Button>
          <Button type="button" onClick={onCancel}>
            Close
          </Button>
        </DialogActions>
      </$Form>
    </div>
  )
}

export default ForgetPassword
