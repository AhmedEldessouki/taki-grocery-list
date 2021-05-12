import React from 'react'
import {useMutation, useQueryClient} from 'react-query'
import type {MyResponseType} from '../../../types/api'
import type {UserDataType} from '../../../types/user'
import {notify} from '../../lib/notify'
import {postOneLevelDeep} from '../../lib/post'
import SingleFieldForm from './singleFieldForm'

function ListName({user, isLoading}: {user: UserDataType; isLoading: boolean}) {
  const [listNameST, setListName] = React.useState<string>(user.listName)
  const [userConfirmed, setUserConfirmed] = React.useState(false)
  const [isPending, setPending] = React.useState(false)
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async (newData: string) => {
      const response = await postOneLevelDeep<Pick<UserDataType, 'listName'>>({
        collection: 'users',
        doc: user.userId,
        data: {listName: newData},
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

  async function handleListNameUpdate(e: React.SyntheticEvent) {
    setResponse({error: undefined, isSuccessful: false})
    if (!userConfirmed) return 'unChanged'
    setPending(true)

    const {GroceryListName} = e.currentTarget as typeof e.currentTarget & {
      GroceryListName: {value: string}
    }

    const newListName: string = GroceryListName.value

    if (user.listName === newListName) return 'unChanged'

    setPending(false)
    await mutateAsync(newListName)
    if (responseST.error) {
      notify('❌', `Update Failed!`, {
        color: 'var(--red)',
      })
      return status
    }

    return status
  }
  return (
    <SingleFieldForm
      onEditStart={() => {}}
      onEditEnd={() => {}}
      isSuccess={!!responseST.isSuccessful}
      isPending={isPending}
      submitFunction={handleListNameUpdate}
      placeholder="Enter Grocery List Name"
      passwordConfirmation={true}
      name="GroceryListName"
      type="text"
      value={isLoading ? 'loading...' : listNameST}
      handleUserConfirmed={(arg: boolean) => setUserConfirmed(arg)}
      onChange={e => setListName(e.target.value)}
    />
  )
}

export default ListName
