import styled from '@emotion/styled'
import React from 'react'
import {Button} from '@material-ui/core'
import {useMutation, useQueryClient} from 'react-query'
import {postTwoLevelDeep} from '../../lib/post'
import {$Warning, mqMax} from '../../shared/utils'
import type {GroceryItemType, MyResponseType} from '../../../types/api'
import {spacefy} from '../../lib/spacefy'
import {$Field} from './sharedCss/field'

const $Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 500px;
`
const $RowWrapper = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 0.5fr 2fr 1fr;
  ${mqMax.s} {
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 300px;
  }
  ${mqMax.xs} {
    width: 250px;
  }
`
const $Pallet = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
`

const $PalletBtns = styled.button<{bgColor: string; checked: boolean}>`
border: 3px solid var(--blackShade);
border-radius: var(--roundness);
width: 25px;
height: 25px;
margin: 5px;
${({checked, bgColor}) => `
background-color: var(--${bgColor});
${checked && `border-color: var(--green)`}`}}
`

function AddStuff({listName}: {listName: string}) {
  const [isPending, setPending] = React.useState(false)
  const [submitFailed, setSubmitFailed] = React.useState('')
  const [priorityST, setPriority] = React.useState('0')
  const [qtyST, setQty] = React.useState('0')
  const [nameST, setName] = React.useState('')
  const [colorValue, setColorValue] = React.useState('transparent')
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (newData: Omit<GroceryItemType, 'isDone'>) => {
      const response = await postTwoLevelDeep<GroceryItemType>({
        collection: 'grocery',
        doc: 'groceryList',
        subCollection: spacefy(listName, {reverse: true}),
        subDoc: spacefy(newData.name, {reverse: true}),
        data: {...newData, isDone: false},
      })
      setResponse({...response})
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(listName)
      },
      onError: (error: Error) => {
        setSubmitFailed(error.message)
      },
    },
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setPending(!isPending)
    if (submitFailed) {
      setSubmitFailed('')
    }

    const {item, quantity, priority} =
      e.currentTarget as typeof e.currentTarget & {
        item: {value: string}
        quantity: {value: number}
        priority: {value: number}
      }

    await mutation.mutateAsync({
      name: item.value,
      quantity: quantity.value,
      priority: priority.value,
      bgColor: colorValue,
    })

    setColorValue('transparent')
    setQty('0')
    setPriority('0')
    setName('')
    setPending(false)
  }

  return (
    <div>
      <$Form onSubmit={handleSubmit}>
        <$RowWrapper>
          <$Field>
            <input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="enter quantity"
              value={qtyST}
              onChange={e => setQty(e.target.value)}
            />
            <label htmlFor="quantity">Qty</label>
          </$Field>
          <$Field>
            <input
              type="text"
              name="item"
              id="item"
              placeholder="enter item"
              required
              value={nameST}
              onChange={e => setName(e.target.value)}
            />
            <label htmlFor="item">New Grocery Item</label>
          </$Field>
        </$RowWrapper>
        <$RowWrapper>
          <$Pallet>
            <$PalletBtns
              type="button"
              bgColor="transparent"
              checked={colorValue === 'transparent'}
              onClick={() => setColorValue('transparent')}
            ></$PalletBtns>
            <$PalletBtns
              type="button"
              bgColor="mattBlue"
              checked={colorValue === 'mattBlue'}
              onClick={() => setColorValue('mattBlue')}
            ></$PalletBtns>
            <$PalletBtns
              type="button"
              bgColor="mattRed"
              checked={colorValue === 'mattRed'}
              onClick={() => setColorValue('mattRed')}
            ></$PalletBtns>
            <$PalletBtns
              type="button"
              bgColor="mattGray"
              checked={colorValue === 'mattGray'}
              onClick={() => setColorValue('mattGray')}
            ></$PalletBtns>
          </$Pallet>
          <$Field>
            <input
              type="number"
              name="priority"
              id="priority"
              required
              placeholder="enter priority Number"
              value={priorityST}
              onChange={e => setPriority(e.target.value)}
            />
            <label htmlFor="priority">priority no.</label>
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
        </$RowWrapper>
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
