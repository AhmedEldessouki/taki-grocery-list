import React, {useState} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {FormattedMessage} from 'react-intl'
import {postOneLevelDeep} from '../../lib/post'
import myFirebase, {auth} from '../../lib/firebase'
import {getOneLevelDeepDoc} from '../../lib/get'
import notify from '../../lib/notify'
import {useAuth} from '../../context/auth'
import {$Warning} from '../../shared/utils'
import DeleteUser from '../deleteUser'
import SingleFieldForm from '../forms/singleFieldForm'
import ChangePassword from '../forms/changePassword'

import type {MyResponseType} from '../../../types/api'
import type UserDataType from '../../../types/user'
import Spinner from '../spinner'
import Button from '../button'

// TODO: Find a good way to only do the success animation once after it succeeds not after it succeeds and when the next field is open
function UserInfo({
  showDialog,
  user,
  closeDialog,
}: {
  showDialog: boolean
  user: myFirebase.User
  closeDialog: () => void
}) {
  const {setUser: setUserAuth} = useAuth()

  const [nameST, setName] = useState<string>('')
  const [emailST, setEmail] = useState<string>('')
  const [listNameST, setListName] = useState<string[]>([''])
  const [isPending, setPending] = useState(false)
  const [isEditActive, setIsEditActive] = useState(false)
  const [userConfirmed, setUserConfirmed] = useState(false)
  const [responseST, setResponse] = useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })
  const [userST, setUser] = useState<UserDataType>({
    email: '',
    name: '',
    listName: [''],
    userId: '',
  })
  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async (newData: unknown) => {
      const response = await postOneLevelDeep<unknown>({
        collection: 'users',
        doc: user?.uid,
        data: newData,
        merge: true,
      })
      // THIS IS A BLUFF ... Not Sure IF It Will [[[WORK]]]
      setResponse({...response})
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user')
      },
    },
  )
  React.useEffect(() => {
    auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        return setUserAuth(currentUser)
      }
      return setUserAuth(null)
    })
  }, [setUserAuth])

  const {isLoading, isFetching} = useQuery('user', {
    queryFn: async () => {
      const {
        isSuccessful,
        data,
        error: err,
      } = await getOneLevelDeepDoc<UserDataType>({
        collection: 'users',
        doc: user.uid,
      })
      setResponse({isSuccessful, error: err})
      return data
    },
    onSuccess: data => {
      if (!data) return
      setUser({...data})
      setName(data.name ?? '')
      setEmail(() => data.email ?? user.email)
      setListName(data.listName ?? [''])
    },
  })

  const onEditStart = React.useCallback(() => {
    setIsEditActive(true)
  }, [setIsEditActive])
  const onEditEnd = React.useCallback(() => {
    setIsEditActive(false)
  }, [setIsEditActive])

  const handleNameUpdate = React.useCallback(
    async (e: React.SyntheticEvent) => {
      setResponse({error: undefined, isSuccessful: false})

      const {name} = e.currentTarget as typeof e.currentTarget & {
        name: {value: string}
      }

      if (userST.name === name.value) return 'unChanged'

      let status: string = 'idle'
      setPending(true)

      await user
        ?.updateProfile({
          displayName: name.value,
        })
        .then(
          () => {
            setResponse({error: undefined, isSuccessful: true})
            status = 'resolved'
          },
          (err: Error) => {
            setResponse({isSuccessful: false, error: err})
            status = 'rejected'
          },
        )
        .catch((err: Error) => {
          setResponse({isSuccessful: false, error: err})
          status = 'rejected'
        })
      await mutateAsync({name: name.value})

      setPending(false)

      if (responseST.error) {
        notify('❌', `Update Failed!`, {
          color: 'var(--red)',
        })
        return status
      }
      notify('✔', `Name Updated!`, {
        color: 'var(--green)',
      })
      return status
    },
    [mutateAsync, responseST.error, user, userST.name],
  )

  const handleEmailUpdate = React.useCallback(
    async (e: React.SyntheticEvent) => {
      setResponse({error: undefined, isSuccessful: false})
      if (!userConfirmed) return 'unChanged'
      let status: string = 'idle'
      const {email} = e.currentTarget as typeof e.currentTarget & {
        email: {value: string}
      }
      if (userST.email === email.value) return 'unChanged'
      setPending(true)

      await user
        ?.updateEmail(email.value)
        .then(
          () => {
            setResponse({error: undefined, isSuccessful: true})
            status = 'resolved'
          },
          (err: Error) => {
            setResponse({isSuccessful: false, error: err})
            status = 'rejected'
          },
        )
        .catch((err: Error) => {
          setResponse({isSuccessful: false, error: err})
          status = 'rejected'
        })
      await mutateAsync({email: email.value})

      setPending(false)

      if (responseST.error) {
        notify('❌', `Update Failed!`, {
          color: 'var(--red)',
        })
        return status
      }
      notify('✔', `email Updated!`, {
        color: 'var(--green)',
      })
      return status
    },
    [mutateAsync, responseST.error, user, userConfirmed, userST.email],
  )

  return (
    <Dialog
      open={showDialog}
      onClose={() => {
        if (isPending || isEditActive) return
        closeDialog()
      }}
      aria-labelledby="sign-in-dialog"
    >
      {!user ? (
        <$Warning> User Doesn&apos;t Exist</$Warning>
      ) : (
        <div>
          <DialogTitle id="sign-in-dialog">
            <FormattedMessage id="nav.account" defaultMessage="User Info" />
            <Spinner
              mount={isFetching || isLoading}
              styling={{
                position: 'absolute',
                marginTop: '-27px',
                marginLeft: '80px',
                zIndex: 9999999,
              }}
            />
          </DialogTitle>
          <DialogContent style={{paddingTop: '0'}}>
            <SingleFieldForm
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
              isSuccess={!!responseST.isSuccessful}
              isPending={isPending}
              submitFunction={handleNameUpdate}
              name="name"
              type="text"
              placeholder="Enter name"
              value={nameST}
              onChange={e => setName(e.target.value)}
            />
            <SingleFieldForm
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
              isSuccess={!!responseST.isSuccessful}
              isPending={isPending}
              submitFunction={handleEmailUpdate}
              passwordConfirmation
              placeholder="Enter email address"
              name="email"
              type="email"
              value={emailST}
              handleUserConfirmed={(arg: boolean) => setUserConfirmed(arg)}
              onChange={e => setEmail(e.target.value)}
            />
            <SingleFieldForm
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
              isSuccess={false}
              isPending
              submitFunction={async () => 'unchanged'}
              placeholder="enter a grocery list name"
              name="lists"
              type="text"
              value={listNameST.join(', ')}
            />
          </DialogContent>
          <ChangePassword />
          <DeleteUser />
          {responseST.error && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <$Warning role="alert">{responseST.error.message}</$Warning>
            </div>
          )}
          <DialogActions
            style={{
              justifyContent: 'space-evenly',
              padding: ' 25px 0',
              minWidth: '50%',
            }}
          >
            <Button
              type="button"
              bgColor="var(--blue)"
              style={{
                color: 'var(--white)',
              }}
              onClick={() => {
                if (isPending || isEditActive) return
                closeDialog()
              }}
              aria-label="close model"
            >
              <FormattedMessage id="close" defaultMessage="Close" />
            </Button>
          </DialogActions>
        </div>
      )}
    </Dialog>
  )
}

export default UserInfo
