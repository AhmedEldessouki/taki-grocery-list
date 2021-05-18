/* eslint-disable @typescript-eslint/prefer-optional-chain */
import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import {nanoid} from 'nanoid'
import React from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import type {GroceryItemType, MyResponseType} from '../../types/api'
import type {UserDataType} from '../../types/user'
import {deleteTwoLevelDeep} from '../lib/delete'
import {getOneLevelDeepDoc, getTwoLevelDeep} from '../lib/get'
import {spacefy} from '../lib/spacefy'
import {$Warning, mqMax} from '../shared/utils'
import NewList from './addList'
import DeleteFromDB from './deleteFromDB'
import AddStuff from './forms/addStuff'
import ListName from './forms/listName'
import Spinner from './spinner'

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

  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async ({list, itemName}: {list: string; itemName: string}) => {
      const response = await deleteTwoLevelDeep({
        collection: 'grocery',
        doc: 'groceryList',
        subCollection: list,
        subDoc: itemName,
      })
      // THIS IS A BLUFF ... Not Sure IF It Will [[[WORK]]]
      setResponse({...response})
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(listName)
      },
    },
  )
  async function deleteItem(itemName: string) {
    await mutateAsync({list: spacefy(listName, {reverse: true}), itemName})
  }

  if (listName.length === 0) {
    return <div>Please Rename Your List.</div>
  }
  if (isLoading) {
    return <Spinner mount={isLoading} />
  }
  return (
    <$ItemsContainer>
      <Spinner
        mount={isFetching}
        styling={{marginTop: '-98px', marginLeft: '-190px'}}
      />
      {groceries?.map(item => {
        return (
          <DeleteFromDB
            key={nanoid()}
            deleteFn={() => deleteItem(spacefy(item.name, {reverse: true}))}
            dialogDeleting={item.name}
            dialogLabelledBy="delete-from-grocery-list"
          >
            <Item item={item} />
          </DeleteFromDB>
        )
      })}
      {responseST.error && <$Warning>{responseST.error.message}</$Warning>}
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
      <Spinner
        mount={isFetching || isLoading}
        styling={{marginTop: '10px', left: '10px'}}
      />
      <NewList
        userId={userData.userId}
        setArrayChange={setArray}
        oldList={userData.listName}
        listName="grocery"
        listArray={arrayST}
      />

      {!isLoading &&
        userData.listName.map((item, i) => {
          return (
            <div
              key={i}
              style={{
                margin: '30px 0',
              }}
            >
              <ListName index={i} user={userData} />
              <Items listName={item} />
              <AddStuff listName={item} />
            </div>
          )
        })}
    </>
  )
}
export default Grocery
