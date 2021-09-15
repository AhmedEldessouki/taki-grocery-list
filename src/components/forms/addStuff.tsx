import styled from '@emotion/styled'
import React from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {FormattedMessage} from 'react-intl'
import English from '../../lang/en.json'
import {$Warning, mqMax} from '../../shared/utils'
import type {GroceryItemType, MyResponseType} from '../../../types/api'
import spacefy from '../../lib/spacefy'
import {db} from '../../lib/firebase'
import notify from '../../lib/notify'
import $Field from './sharedCss/field'
import Button from '../button'

const $Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  ${mqMax.s} {
    width: 100%;
  }
`
const $RowWrapper = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 0.5fr 1.5fr;
  max-width: 450px;
  ${mqMax.s} {
    display: grid;
    grid-template-columns: 1fr 2fr;
    max-width: 350px;
  }
  ${mqMax.xs} {
    max-width: 300px;
  }
`
const $Pallet = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
`

const $PalletBtns = styled.button<{bgColor: string; checked: boolean}>`
border: 3px solid var(--blackShade);
border-radius: var(--roundness);
width: 25px;
height: 25px;
margin: 2px;
cursor: pointer;
${({checked, bgColor}) => `
background-color: var(--${bgColor});
${checked && `border-color: var(--green)`}
`}}
:hover, :focus {
  border-color: dodgerblue;
  outline: none !important;
}
`

type AddStuffPropsType = {
  listName: string
  itemNameE?: string
  itemBgColorE?: string
  itemQuantityE?: number
  itemPriorityE?: number
  itemIsDoneE?: boolean
  isEdit?: boolean
  idx: number
}

function AddStuff({
  listName,
  itemPriorityE,
  itemQuantityE,
  itemNameE,
  itemBgColorE,
  itemIsDoneE,
  isEdit,
  idx,
}: AddStuffPropsType) {
  const [isPending, setPending] = React.useState(false)
  const [submitFailed, setSubmitFailed] = React.useState('')
  // * by default [4] add it to the end of the list
  const [priorityST, setPriority] = React.useState(4)
  const [qtyST, setQty] = React.useState('0')
  const [nameST, setName] = React.useState('')
  const [oldNameST, setOldNameST] = React.useState<string | undefined>(
    undefined,
  )
  const [colorValue, setColorValue] = React.useState('white')
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  React.useEffect(() => {
    if (!isEdit) return
    setPriority(Number(itemPriorityE) ?? 4)
    setQty(`${itemQuantityE ?? 0}`)
    setName(itemNameE ?? '')
    setOldNameST(itemNameE)
    setColorValue(itemBgColorE ?? '')
  }, [isEdit, itemBgColorE, itemNameE, itemPriorityE, itemQuantityE])

  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (newData: Omit<GroceryItemType, 'isDone'>) => {
      const batch = db.batch()

      const listRef = db
        .collection('grocery')
        .doc('groceryList')
        .collection(spacefy(listName, {reverse: true}))

      if (oldNameST && oldNameST !== newData.name) {
        const oldItemRef = listRef.doc(spacefy(oldNameST, {reverse: true}))
        batch.delete(oldItemRef)
      }
      const newItemRef = listRef.doc(spacefy(newData.name, {reverse: true}))
      batch.set(newItemRef, {...newData, isDone: itemIsDoneE ?? false})
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

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setPending(!isPending)
      if (submitFailed) {
        setSubmitFailed('')
      }

      const {itemName, quantity} = e.currentTarget as typeof e.currentTarget & {
        itemName: {value: string}
        quantity: {value: number}
      }

      let itemNameEn = itemName.value

      if (itemName.value in English) {
        itemNameEn = (English as {[key: string]: string})[itemName.value]
      }

      await mutation.mutateAsync({
        name: itemNameEn,
        quantity: quantity.value,
        priority: priorityST,
        bgColor: colorValue,
      })

      setColorValue('white')
      setQty('0')
      setPriority(4)
      setName('')
      setPending(false)
    },
    [colorValue, isPending, mutation, priorityST, submitFailed],
  )

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
            <label htmlFor={`quantity-${idx}`}>
              <FormattedMessage id="qty" defaultMessage="qty" />
            </label>
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
            <label htmlFor={`itemName-${idx}`}>
              <FormattedMessage id="name" defaultMessage="Name" />
            </label>
          </$Field>
        </$RowWrapper>
        <$RowWrapper>
          <$Pallet>
            <$PalletBtns
              type="button"
              bgColor="mattBlue"
              data-testid="mattBlue"
              checked={colorValue === 'mattBlue'}
              onClick={() => {
                setColorValue('mattBlue')
                setPriority(1)
              }}
            />
            <$PalletBtns
              type="button"
              bgColor="mattGray"
              data-testid="mattGray"
              checked={colorValue === 'mattGray'}
              onClick={() => {
                setColorValue('mattGray')
                setPriority(2)
              }}
            />
            <$PalletBtns
              type="button"
              bgColor="mattRed"
              data-testid="mattRed"
              checked={colorValue === 'mattRed'}
              onClick={() => {
                setColorValue('mattRed')
                setPriority(3)
              }}
            />
            <$PalletBtns
              type="button"
              bgColor="white"
              data-testid="white"
              checked={colorValue === 'white'}
              onClick={() => {
                setColorValue('white')
                setPriority(4)
              }}
            />
          </$Pallet>
          <Button
            type="submit"
            style={{
              background: !isPending ? 'var(--green)' : 'var(--red)',
              color: 'var(--white)',
              minWidth: '88px',
            }}
          >
            <FormattedMessage id="add" />
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
