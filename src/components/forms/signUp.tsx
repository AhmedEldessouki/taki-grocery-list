import React, {useEffect, useState} from 'react'
import styled from '@emotion/styled'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {FormattedMessage} from 'react-intl'
import {useAuth} from '../../context/auth'
import {$Warning, mqMax} from '../../shared/utils'
import {namePattern} from '../../lib/patterns'
import myFirebase from '../../lib/firebase'
import {postOneLevelDeep} from '../../lib/post'
import notify from '../../lib/notify'
import type UserDataType from '../../../types/user'
import Spinner from '../spinner'
import $Field from './sharedCss/field'
import PasswordFields from './passwordFields'
import Button from '../button'

const $Container = styled.form`
  font-weight: 300;
  display: flex;
  flex-direction: column;
  place-content: center;
  margin: 0rem auto 1rem;
  overflow: auto;
  width: 500px;
  ${mqMax.phoneLarge} {
    width: 400px;
  }
  ${mqMax.s} {
    width: 300px;
  }
  ${mqMax.xs} {
    width: 250px;
  }
`

function SignUpForm({
  showDialog,
  onClose,
}: {
  showDialog: boolean
  onClose: () => void
}) {
  const {signUp} = useAuth()

  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)
  const [didSignUpFailed, setDidSignUpFailed] = useState('')
  const [isPending, setPending] = useState(false)

  useEffect(() => {
    setDidSignUpFailed('')
    setPending(false)
  }, [])

  const handleSubmit = React.useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDidSignUpFailed('')

      setPending(!isPending)

      const {email, password, name, listName} = e.target as typeof e.target & {
        email: {value: string}
        password: {value: string}
        name: {value: string}
        listName: {value: string}
      }
      const newUserCred = {
        email: email.value,
        password: password.value,
      }
      if (!isPasswordConfirmed) return

      const {user, error} = await signUp(newUserCred)

      if (error) {
        setDidSignUpFailed(error)
        setPending(false)
        return
      }
      if (user) {
        notify('????', `Hello, ${name.value}!`, {
          color: 'var(--white)',
        })
      }
      if (!user?.user?.uid) {
        return
      }
      const newUserData: UserDataType = {
        name: name.value,
        listName: [listName.value],
        email: email.value,
        userId: user.user.uid,
        timeStamp: myFirebase.firestore.Timestamp.now().toDate(),
      }

      await user.user.updateProfile({displayName: name.value})

      const {error: err, isSuccessful} = await postOneLevelDeep<UserDataType>({
        collection: 'users',
        doc: user.user.uid,
        data: newUserData,
      })

      if (err) {
        setDidSignUpFailed(err.message)
        notify('???', `Update Failed!`, {
          color: 'var(--red)',
        })
      } else if (isSuccessful) {
        notify('???', `Your info Updated!`, {color: 'var(--green)'})
      }
      setPending(false)
      onClose()
    },
    [isPasswordConfirmed, isPending, onClose, signUp],
  )

  return (
    <Dialog
      open={showDialog}
      onClose={onClose}
      aria-labelledby="sign-in-dialog"
    >
      <DialogTitle style={{paddingBottom: '0'}} id="sign-in-dialog">
        <FormattedMessage id="sign.up" defaultMessage="Sign Up" />
      </DialogTitle>
      <$Container id="sign-up" onSubmit={handleSubmit}>
        <DialogContent style={{paddingTop: '0'}}>
          <$Field>
            <input
              name="name"
              id="name"
              pattern={namePattern}
              placeholder="Enter full name"
              required
              minLength={3}
              type="text"
            />
            <label htmlFor="name">
              <FormattedMessage id="name" defaultMessage="Name" />
            </label>
          </$Field>

          <$Field>
            <input
              name="email"
              id="email"
              type="email"
              required
              placeholder="Email Address"
            />
            <label htmlFor="email">
              <FormattedMessage id="email" defaultMessage="Email" />
            </label>
          </$Field>
          <$Field>
            <input
              name="listName"
              id="listName"
              type="text"
              placeholder="Enter grocery list name"
              required
            />
            <label htmlFor="listName">
              <FormattedMessage
                id="newList"
                defaultMessage="Grocery List Name"
              />
            </label>
          </$Field>
          <PasswordFields setIsPasswordConfirmed={setIsPasswordConfirmed} />
        </DialogContent>
        {didSignUpFailed ? (
          <$Warning role="alert">{didSignUpFailed}</$Warning>
        ) : null}
        <DialogActions
          style={{
            justifyContent: 'space-evenly',
            paddingBottom: '10px',
            minWidth: '50%',
          }}
        >
          <Button
            disabled={isPending || !isPasswordConfirmed}
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
          <Button disabled={isPending} type="button" onClick={onClose}>
            <FormattedMessage id="close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </$Container>
    </Dialog>
  )
}

function SignUp() {
  const [showDialog, setShowDialog] = useState(false)

  const openDialog = () => setShowDialog(true)

  return (
    <>
      <Button type="button" onClick={openDialog}>
        <FormattedMessage id="sign.up" defaultMessage="Sign Up" />
      </Button>
      {showDialog && (
        <SignUpForm
          showDialog={showDialog}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  )
}

export default SignUp
