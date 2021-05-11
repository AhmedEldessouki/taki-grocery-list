import styled from '@emotion/styled'
import React from 'react'
import {Button} from '@material-ui/core'
import {useMutation, useQueryClient} from 'react-query'
import {postTwoLevelDeep} from '../../lib/post'
import {$Warning, mqMax} from '../../shared/utils'
import type {GroceryItemType, MyResponseType} from '../../../types/api'
import {$Field} from './sharedCss/field'

const $Form = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  width: 500px;
  ${mqMax.s} {
    width: 300px;
  }
  ${mqMax.xs} {
    width: 250px;
  }
`

function AddStuff({listName}: {listName: string}) {
  const [isPending, setPending] = React.useState(false)
  const [submitFailed, setSubmitFailed] = React.useState('')
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (newData: string) => {
      const response = await postTwoLevelDeep<GroceryItemType>({
        collection: 'grocery',
        doc: 'groceryList',
        subCollection: listName,
        subDoc: newData,
        data: {name: newData, isDone: false},
      })
      setResponse({...response})
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('grocery')
      },
      onError: (error: Error) => {
        setSubmitFailed(error.message)
      },
    },
  )

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    setPending(!isPending)
    if (submitFailed) {
      setSubmitFailed('')
    }

    const {item} = e.target as typeof e.target & {
      item: {value: string}
    }

    mutation.mutateAsync(item.value)

    setPending(false)
  }
  if (listName.length === 0) {
    return <div>Please Name your List</div>
  }
  return (
    <div>
      <$Form onSubmit={handleSubmit}>
        <$Field>
          <input
            type="text"
            name="item"
            id="item"
            placeholder="enter item"
            required
          />
          <label htmlFor="item">New Grocery Item</label>
        </$Field>
        <Button
          type="submit"
          variant="contained"
          style={{
            background: !isPending ? 'var(--green)' : 'var(--red)',
            color: 'var(--white)',
            minWidth: '88px',
          }}
        >
          Add Item
        </Button>
      </$Form>
      {responseST.error && (
        <$Warning role="alert" marginBottom="10">
          {responseST.error.message}
        </$Warning>
      )}
    </div>
  )
}

export default AddStuff
