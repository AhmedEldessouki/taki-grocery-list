/* eslint-disable @typescript-eslint/prefer-optional-chain */
import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import {nanoid} from 'nanoid'
import React from 'react'
import {useQuery} from 'react-query'
import type {GroceryItemType, MyResponseType} from '../../types/api'
import type {UserDataType} from '../../types/user'
import {getOneLevelDeepDoc, getTwoLevelDeep} from '../lib/get'
import {spacefy} from '../lib/spacefy'
import {$Warning, mqMax} from '../shared/utils'
import NewList from './addList'
import DeleteFromDB from './deleteFromDB'
import AddStuff from './forms/addStuff'
import ListName from './forms/listName'

const $Item = styled.span<{isDone: boolean}>`
  font-size: larger;
  text-transform: capitalize;
  ${({isDone}) =>
    isDone &&
    `
text-decoration-line: line-through;
`}
`
const $ItemContainer = styled.div<{isDone: boolean}>`
  display: flex;
  align-items: center;
  width: 500px;
  padding: 5px 10px;
  ${mqMax.s} {
    width: 300px;
  }
  ${mqMax.xs} {
    width: 250px;
  }
  ${({isDone}) =>
    isDone &&
    `
background: var(--blackShade);
color: var(--white);
`}
`
function Item({item}: {item: GroceryItemType}) {
  const [isDone, setDone] = React.useState(item.isDone)

  return (
    <$ItemContainer isDone={isDone}>
      <$Item style={{flex: 1}} isDone={isDone}>
        {item.quantity && item.quantity} {item.name}
      </$Item>
      <Button
        onClick={() => setDone(!isDone)}
        style={{width: '50px'}}
        variant="outlined"
      >
        ✔
      </Button>
    </$ItemContainer>
  )
}
const $ItemsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px 0;
`
function Items({listName}: {listName: string}) {
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })
  const {
    data: groceries,
    isLoading,
    isFetching,
  } = useQuery(listName, {
    queryFn: async () => {
      const {
        isSuccessful,
        data,
        error: err,
      } = await getTwoLevelDeep<GroceryItemType>({
        collection: 'grocery',
        doc: 'groceryList',
        subCollection: spacefy(listName, {reverse: true}),
      })
      if (!isSuccessful) {
        setResponse({isSuccessful, error: err})
      }
      return data
    },
  })
  async function deleteItem() {}

  if (listName.length === 0) {
    return <div>Please Name your List</div>
  }
  if (isLoading || isFetching) {
    return <div>Loading</div>
  }
  if (responseST.error) {
    return <$Warning>{responseST.error.message}</$Warning>
  }
  return (
    <$ItemsContainer>
      {groceries?.map(item => {
        return (
          <DeleteFromDB
            key={nanoid()}
            deleteFn={deleteItem}
            dialogDeleting={item.name}
            dialogLabelledBy="delete-from-grocery-list"
          >
            <Item item={item} />
          </DeleteFromDB>
        )
      })}
    </$ItemsContainer>
  )
}

function Grocery({userId}: {userId: string}) {
  const [errorST, setError] = React.useState<Error>()
  const [arrayST, setArray] = React.useState<Array<string>>([])

  const {
    data: userData,
    isLoading,
    isError,
    isFetching,
  } = useQuery('user', {
    queryFn: async () => {
      const {isSuccessful, data, error} =
        await getOneLevelDeepDoc<UserDataType>({
          collection: 'users',
          doc: userId,
        })
      if (!isSuccessful) {
        setError(error)
      }
      return data
    },
  })

  if (isError || !userData) {
    return <div>{errorST?.message}</div>
  }

  return (
    <>
      <NewList
        setArrayChange={setArray}
        oldList={userData.listName}
        listName="grocery"
        listArray={arrayST}
      />

      {userData.listName.map((item, i) => {
        const list = isLoading || isFetching ? 'loading' : item
        return (
          <div
            key={i}
            style={{
              margin: '30px 0',
            }}
          >
            <ListName index={i} user={userData} />
            <Items listName={list} />
            <AddStuff listName={list} />
          </div>
        )
      })}
    </>
  )
}
export default Grocery
