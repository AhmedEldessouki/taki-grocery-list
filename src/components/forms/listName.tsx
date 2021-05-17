import React from 'react'
import {useMutation, useQueryClient} from 'react-query'
import type {MyResponseType} from '../../../types/api'
import type {UserDataType} from '../../../types/user'
import {notify} from '../../lib/notify'
import {postOneLevelDeep} from '../../lib/post'
import SingleFieldForm from './singleFieldForm'

function ListName({user, index}: {user: UserDataType; index: number}) {
  const [listNameST, setListName] = React.useState<string>(user.listName[index])
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
        doc: user.userId,
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

  async function handleListNameUpdate(e: React.SyntheticEvent) {
    setResponse({error: undefined, isSuccessful: false})
    if (!userConfirmed) return 'unChanged'
    setPending(true)

    const {groceryListName} = e.currentTarget as typeof e.currentTarget & {
      groceryListName: {value: string}
    }
    if (user.listName[index] === groceryListName.value) return 'unChanged'

    user.listName.splice(index, 1, groceryListName.value)
    const newListName: string[] = user.listName
    console.log('[[submitting]]', groceryListName, user.listName)
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
        passwordConfirmation={true}
        name="groceryListName"
        type="text"
        value={listNameST}
        handleUserConfirmed={(arg: boolean) => setUserConfirmed(arg)}
        onChange={e => setListName(e.target.value)}
      />
    </div>
  )
}

export default ListName
