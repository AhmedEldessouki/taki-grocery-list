import React, {useEffect, useState} from 'react'

import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useAuth} from '../../context/auth'
import {$Warning, mqMax} from '../../shared/utils'
import {namePattern, telPattern} from '../../lib/patterns'
import firebase from '../../lib/firebase'
import {postOneLevelDeep} from '../../lib/post'
import {notify} from '../../lib/notify'
import type {UserDataType} from '../../../types/user'
import {$Field} from './sharedCss/field'
import PasswordFields from './passwordFields'

const $Container = styled.form`
  font-weight: 300;
  display: flex;
  flex-direction: column;
  place-content: center;
  margin: 0rem auto 1rem;
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

  async function handleSubmit(e: React.SyntheticEvent) {
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
    } else if (user) {
      notify('🙂', `Hello, ${name.value}!`, {
        color: 'var(--lightGray)',
      })
    }
    if (!user?.user?.uid) {
      return
    }
    const newUserData: UserDataType = {
      name: name.value,
      listName: listName.value,
      email: email.value,
      userId: user.user.uid,
      timeStamp: firebase.firestore.Timestamp.now().toDate(),
    }

    await user.user.updateProfile({displayName: name.value})

    const {error: err, isSuccessful} = await postOneLevelDeep<UserDataType>({
      collection: 'users',
      doc: user.user.uid,
      data: newUserData,
    })

    if (err) {
      setDidSignUpFailed(err.message)
      notify('❌', `Update Failed!`, {
        color: 'var(--red)',
      })
    } else if (isSuccessful) {
      notify('✔', `Your info Updated!`, {color: 'var(--green)'})
    }
    setPending(false)
    onClose()
  }

  return (
    <Dialog
      open={showDialog}
      onClose={onClose}
      aria-labelledby="sign-in-dialog"
    >
      <DialogTitle style={{paddingBottom: '0'}} id="sign-in-dialog">
        Sign up
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
            <label htmlFor="name">Name</label>
          </$Field>
          <$Field>
            <input
              pattern={telPattern}
              name="listName"
              id="listName"
              type="text"
              placeholder="Enter grocery list name"
              required
            />
            <label htmlFor="listName">Grocery List Name</label>
          </$Field>
          <$Field>
            <input
              name="email"
              id="email"
              type="email"
              required
              placeholder="Email Address"
            />
            <label htmlFor="email">Email</label>
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
              background: !isPending ? 'var(--green)' : 'var(--red)',
              color: 'var(--lightGray)',
            }}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            disabled={isPending}
            type="button"
            variant="contained"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogActions>
      </$Container>
    </Dialog>
  )
}

function SignUp({isVerified}: {isVerified?: boolean}) {
  const [showDialog, setShowDialog] = useState(false)

  const openDialog = () => setShowDialog(true)

  return (
    <>
      <Button variant="contained" disabled={false} onClick={openDialog}>
        Sign Up
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
