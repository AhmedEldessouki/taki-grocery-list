import React, {useState} from 'react'
import styled from '@emotion/styled'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {FormattedMessage} from 'react-intl'
import {useAuth} from '../../context/auth'
import {$Warning, mqMax} from '../../shared/utils'
import Spinner from '../spinner'
import $Field from './sharedCss/field'
import ForgetPassword from './forgetPassword'
import Button from '../button'

const $Form = styled.form`
  width: 300px;
  ${mqMax.xs} {
    width: 250px;
  }
`

const SignInForm = ({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const {signIn, setUser} = useAuth()
  const [forgetPassword, setForgetPassword] = useState(false)
  const [signInFailed, setSignInFailed] = useState('')
  const [isPending, setPending] = useState(false)

  const closeDialog = () => setShowDialog(false)

  const handleSignInForm = React.useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setPending(!isPending)

      if (signInFailed) {
        setSignInFailed('')
      }

      const {signInEmail, signInPassword} = e.target as typeof e.target & {
        signInEmail: {value: string}
        signInPassword: {value: string}
      }
      const credentials = {
        email: signInEmail.value,
        password: signInPassword.value,
      }

      const {user, error} = await signIn(credentials)
      if (error) {
        setSignInFailed(error)
      }
      setUser(user?.user ?? null)
      setPending(false)
    },
    [isPending, setUser, signIn, signInFailed],
  )

  return (
    <Dialog
      open={showDialog}
      onClose={closeDialog}
      aria-labelledby="sign-in-dialog"
    >
      {forgetPassword ? (
        <ForgetPassword onCancel={() => setForgetPassword(!forgetPassword)} />
      ) : (
        <div>
          <DialogTitle style={{paddingBottom: '0'}} id="sign-in-dialog">
            <FormattedMessage id="sign.in" defaultMessage="Sign In" />
          </DialogTitle>
          <$Form onSubmit={handleSignInForm}>
            <DialogContent style={{paddingTop: '0'}}>
              <$Field>
                <input
                  name="signInEmail"
                  id="signInEmail"
                  placeholder="Enter email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <label htmlFor="signInEmail">
                  <FormattedMessage id="email" defaultMessage="Email" />
                </label>
              </$Field>
              <$Field>
                <input
                  name="signInPassword"
                  id="signInPassword"
                  type="password"
                  minLength={6}
                  required
                  placeholder="Enter password"
                />
                <label htmlFor="signInPassword">
                  <FormattedMessage id="password" defaultMessage="Password" />
                </label>
              </$Field>
            </DialogContent>
            <Button
              onClick={() => setForgetPassword(!forgetPassword)}
              type="button"
              style={{marginLeft: '15px'}}
            >
              <FormattedMessage
                id="password.forget"
                defaultMessage="Forget Password"
              />
            </Button>
            {signInFailed && <$Warning role="alert">{signInFailed}</$Warning>}
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
                  color: 'var(--white)',
                }}
                bgColor="var(--green)"
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
                  <FormattedMessage id="submit" defaultMessage="Submit" />
                )}
              </Button>
              <Button type="button" onClick={closeDialog}>
                <FormattedMessage id="close" defaultMessage="Close" />
              </Button>
            </DialogActions>
          </$Form>
        </div>
      )}
    </Dialog>
  )
}

const SignIn = () => {
  const [showDialog, setShowDialog] = useState(false)

  const openDialog = () => setShowDialog(true)

  return (
    <>
      <Button
        onClick={openDialog}
        type="button"
        bgColor="var(--blue)"
        style={{color: 'var(--white)'}}
      >
        <FormattedMessage id="sign.in" defaultMessage="Sign In" />
      </Button>
      {showDialog && (
        <SignInForm showDialog={showDialog} setShowDialog={setShowDialog} />
      )}
    </>
  )
}

export default SignIn
