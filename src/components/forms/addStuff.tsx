import styled from '@emotion/styled'
import React from 'react'
import {Button} from '@material-ui/core'
import {useMutation, useQueryClient} from 'react-query'
import {$Warning, mqMax} from '../../shared/utils'
import type {GroceryItemType, MyResponseType} from '../../../types/api'
import {spacefy} from '../../lib/spacefy'
import {db} from '../../lib/firebase'
import {notify} from '../../lib/notify'
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

type AddStuffPropsType = {
  listName: string
  item?: Omit<GroceryItemType, 'isDone'>
  isEdit?: boolean
  idx: number
}

function AddStuff({listName, item, isEdit, idx}: AddStuffPropsType) {
  const [isPending, setPending] = React.useState(false)
  const [submitFailed, setSubmitFailed] = React.useState('')
  const [priorityST, setPriority] = React.useState(item?.priority ?? '0')
  const [qtyST, setQty] = React.useState(item?.quantity ?? '0')
  const [nameST, setName] = React.useState(item?.name ?? '')
  const [oldNameST] = React.useState(isEdit ? item?.name : undefined)
  const [colorValue, setColorValue] = React.useState(
    item?.bgColor ?? 'transparent',
  )
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (newData: Omit<GroceryItemType, 'isDone'>) => {
      const batch = db.batch()

      const listRef = db
        .collection('grocery')
        .doc('groceryList')
        .collection(spacefy(listName, {reverse: true}))

      if (oldNameST && oldNameST !== newData.name) {
        console.log('[Deleting]')
        const oldItemRef = listRef.doc(spacefy(oldNameST, {reverse: true}))
        batch.delete(oldItemRef)
      }
      const newItemRef = listRef.doc(spacefy(newData.name, {reverse: true}))
      batch.set(newItemRef, {...newData, isDone: false})

      await batch
        .commit()
        .then(() => {
          notify('👍', `Item ${isEdit ? 'Updated' : 'Created'}`, {
            color: 'var(--green)',
          })
          setResponse({isSuccessful: true})
        })
        .catch((error: Error) => {
          notify('👻', `${isEdit ? 'Updated' : 'Created'} Failed`, {
            color: 'var(--red)',
          })
          setResponse({isSuccessful: false, error})
        })
      console.log('[Update]/[Create]')
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

    const {itemName, quantity, priority} =
      e.currentTarget as typeof e.currentTarget & {
        itemName: {value: string}
        quantity: {value: number}
        priority: {value: number}
      }

    await mutation.mutateAsync({
      name: itemName.value,
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
              id={`quantity-${idx}`}
              placeholder="enter quantity"
              value={qtyST}
              onChange={e => setQty(e.target.value)}
            />
            <label htmlFor={`quantity-${idx}`}>Qty</label>
          </$Field>
          <$Field>
            <input
              type="text"
              name="itemName"
              id={`itemName-${idx}`}
              placeholder="enter item name"
              required
              value={nameST}
              onChange={e => setName(e.target.value)}
            />
            <label htmlFor={`itemName-${idx}`}>New Grocery Item</label>
          </$Field>
        </$RowWrapper>
        <$RowWrapper>
          <$Pallet>
            <$PalletBtns
              type="button"
              bgColor="transparent"
              data-testid="transparent"
              checked={colorValue === 'transparent'}
              onClick={() => setColorValue('transparent')}
            />
            <$PalletBtns
              type="button"
              bgColor="mattBlue"
              data-testid="mattBlue"
              checked={colorValue === 'mattBlue'}
              onClick={() => setColorValue('mattBlue')}
            />
            <$PalletBtns
              type="button"
              bgColor="mattRed"
              data-testid="mattRed"
              checked={colorValue === 'mattRed'}
              onClick={() => setColorValue('mattRed')}
            />
            <$PalletBtns
              type="button"
              bgColor="mattGray"
              data-testid="mattGray"
              checked={colorValue === 'mattGray'}
              onClick={() => setColorValue('mattGray')}
            />
          </$Pallet>
          <$Field>
            <input
              type="number"
              name="priority"
              id={`priority-${idx}`}
              required
              placeholder="enter priority Number"
              value={priorityST}
              onChange={e => setPriority(e.target.value)}
            />
            <label htmlFor={`priority-${idx}`}>priority no.</label>
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
