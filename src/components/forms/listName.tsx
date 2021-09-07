import React from 'react'
import {useMutation, useQueryClient} from 'react-query'
import type {MyResponseType} from '../../../types/api'
import type UserDataType from '../../../types/user'
import notify from '../../lib/notify'
import {postOneLevelDeep} from '../../lib/post'
import SingleFieldForm from './singleFieldForm'

function ListName({
  userID,
  index,
  userLists,
}: {
  userID: string
  userLists: string[]
  index: number
}) {
  const [listNameST, setListName] = React.useState<string>(userLists[index])
  const [userConfirmed, setUserConfirmed] = React.useState(false)
  const [isPending, setPending] = React.useState(false)
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async (newData: string[]) => {
      const response = await postOneLevelDeep<Pick<UserDataType, 'listName'>>({
        collection: 'users',
        doc: userID,
        data: {listName: [...newData]},
        merge: true,
      })
      if (response.error) {
        setResponse({...response})
      }
    },
    {
      onSuccess: () => {
        notify('✔', `List Name Updated!`, {
          color: 'var(--green)',
        })
        queryClient.invalidateQueries('user')
      },
    },
  )

  const handleListNameUpdate = React.useCallback(
    async (e: React.SyntheticEvent) => {
      setResponse({error: undefined, isSuccessful: false})

      if (userLists[index] === listNameST) return 'unChanged'
      if (!userConfirmed) return 'unChanged'

      setPending(true)
      const {groceryListName} = e.currentTarget as typeof e.currentTarget & {
        groceryListName: {value: string}
      }

      userLists.splice(index, 1, groceryListName.value)
      const newListName: string[] = userLists
      setPending(false)
      await mutateAsync(newListName)
      if (responseST.error) {
        notify('❌', `Update Failed!`, {
          color: 'var(--red)',
        })
        return 'rejected'
      }

      return 'resolved'
    },
    [
      index,
      listNameST,
      mutateAsync,
      responseST.error,
      userConfirmed,
      userLists,
    ],
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <SingleFieldForm
        onEditStart={() => {}}
        onEditEnd={() => {}}
        isSuccess={!!responseST.isSuccessful}
        isPending={isPending}
        submitFunction={handleListNameUpdate}
        placeholder="Enter Grocery List Name"
        passwordConfirmation
        name="groceryListName"
        id={`groceryListName${index + 1}`}
        type="text"
        value={listNameST}
        handleUserConfirmed={(arg: boolean) => setUserConfirmed(arg)}
        onChange={e => setListName(e.target.value)}
      />
    </div>
  )
}

export default ListName
