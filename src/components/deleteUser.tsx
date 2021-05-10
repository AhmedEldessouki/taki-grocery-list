import {useCallback, useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import {useAuth} from '../context/auth'
import {$Warning} from '../shared/utils'
import type {MyResponseType} from '../../types/api'
import {notify} from '../lib/notify'
import {deleteOneLevelDeep} from '../lib/delete'
import ConfirmPassword from './forms/confirmPassword'
import DeleteConfirmationDialog from './deleteConfirmationDialog'

function DeleteUser() {
  const {user, setUser} = useAuth()
  const [wantToDelete, setWantToDelete] = useState(false)
  const [userConfirmed, setUserConfirmed] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const [responseST, setResponse] = useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  const deleteUser = useCallback(async () => {
    setResponse({
      error: undefined,
      isSuccessful: false,
    })
    if (!user) return
    const {isSuccessful, error} = await deleteOneLevelDeep({
      collection: 'users',
      doc: user.uid,
    })
    if (isSuccessful) {
      notify('👩🏻‍💻', `info Deleted!`, {
        color: 'var(--lightGray)',
      })
      setResponse({error: undefined, isSuccessful: true})
    } else if (error) {
      notify('🤷🏻‍♀️', `something went Wrong`, {
        color: 'var(--red)',
      })
      setResponse({isSuccessful: false, error: error})
      return
    }

    await user
      .delete()
      .then(
        () => {
          notify('👋🏻', `Welcome Bye!`, {
            color: 'var(--lightGray)',
          })
          setUser(null)
          setResponse({error: undefined, isSuccessful: true})
        },
        err => {
          setResponse({isSuccessful: false, error: err})
          notify('🤷🏻‍♀️', `something went Wrong`, {
            color: 'var(--red)',
          })
        },
      )
      .catch(err => {
        setResponse({isSuccessful: false, error: err})
        notify('🤷🏻‍♀️', `something went Wrong`, {
          color: 'var(--red)',
        })
      })
  }, [setUser, user])

  useEffect(() => {
    if (userConfirmed) {
      deleteUser()
    }
  }, [deleteUser, userConfirmed])

  return (
    <div style={{margin: '10px 22px'}}>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        onClick={() => setWantToDelete(true)}
      >
        Delete Account
      </Button>
      {responseST.error && (
        <$Warning role="alert">{responseST.error.message}</$Warning>
      )}
      <DeleteConfirmationDialog
        showDialog={wantToDelete}
        deleting="your account"
        labelledBy="delete-user-dialog"
        onReject={() => {
          setWantToDelete(false)
        }}
        onAccept={() => {
          setShowDialog(true)
        }}
      />
      <ConfirmPassword
        showDialog={showDialog}
        handleUserConfirmed={arg => setUserConfirmed(arg)}
        pendingStart={() => {}}
        onDialogClose={async () => {
          setShowDialog(false)
        }}
        onDialogCancel={() => {
          setWantToDelete(false)
          setShowDialog(false)
        }}
      />
    </div>
  )
}

export default DeleteUser
