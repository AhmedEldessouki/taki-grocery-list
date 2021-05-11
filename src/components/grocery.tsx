/* eslint-disable @typescript-eslint/prefer-optional-chain */
import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import {nanoid} from 'nanoid'
import React from 'react'
import {useQuery} from 'react-query'
import {GroceryItemType} from '../../types/api'
import {UserDataType} from '../../types/user'
import {getOneLevelDeepDoc, getTwoLevelDeep} from '../lib/get'
import {$Warning, mqMax} from '../shared/utils'
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
  display: grid;
  grid-template-columns: 3fr 1fr;
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
      <$Item isDone={isDone}>{item.name}</$Item>
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
  const {
    data: groceries,
    isError,
    error,
    isLoading,
  } = useQuery('grocery', {
    queryFn: () => {
      return getTwoLevelDeep<GroceryItemType>({
        collection: 'grocery',
        doc: 'groceryList',
        subCollection: listName,
      })
    },
  })
  async function deleteItem() {}

  if (listName.length === 0) {
    return <div>Please Name your List</div>
  }
  if (isLoading) {
    return <div>Loading</div>
  }
  if (isError) {
    console.log(error)
    return <$Warning>error</$Warning>
  }
  return (
    <$ItemsContainer>
      {groceries?.data &&
        groceries.data.map(item => {
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

  const {
    data: user,
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

  if (isLoading || isFetching) {
    return <div>loading...</div>
  }
  if (isError || !user) {
    return <div>{errorST?.message}</div>
  }
  return (
    <>
      <ListName user={user} />
      <Items listName={user.listName} />
      <AddStuff listName={user.listName} />
    </>
  )
}
export default Grocery
