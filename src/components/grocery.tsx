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
import {postTwoLevelDeep} from '../lib/post'
import {db} from '../lib/firebase'
import NewList from './forms/addList'
import DeleteFromDB from './deleteFromDB'
import AddStuff from './forms/addStuff'
import ListName from './forms/listName'
import Spinner from './spinner'
import DeleteConfirmationDialog from './deleteConfirmationDialog'

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
border-radius: var(--roundness);
`}
`
const $CleanUpBtnsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

function ListCleanUp({
  listName,
  userData,
  setError,
}: {
  listName: string
  userData: UserDataType
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>
}) {
  const [wantToDelete, setWantToDelete] = React.useState<'delete' | 'clean'>()
  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async ({
      listNameFn,
      userIdFn,
      cleanUpType,
    }: {
      subDoc?: string
      listNameFn: string
      userIdFn: string
      cleanUpType?: 'delete' | 'clean'
    }) => {
      const batch = db.batch()

      const listRef = db
        .collection('grocery')
        .doc('groceryList')
        .collection(listNameFn)

      await listRef
        .get()
        .then(
          res => {
            res.docs.map(item => listRef.doc(item.id).delete())
          },
          (err: Error) => {
            setError(err)
          },
        )
        .catch((err: Error) => {
          setError(err)
        })
      if (cleanUpType === 'delete') {
        const userRef = db.collection('users').doc(userIdFn)
        userData.listName.splice(userData.listName.indexOf(listNameFn), 1)
        batch.update(userRef, {listName: userData.listName})
      }

      await batch
        .commit()
        .then(() => {
          setWantToDelete(undefined)
        })
        .catch((err: Error) => {
          setError(err)
        })
    },
    {
      onSuccess: () => {
        if (wantToDelete === 'delete') {
          queryClient.invalidateQueries('user')
        }
        queryClient.invalidateQueries(listName)
      },
    },
  )

  return (
    <>
      <$CleanUpBtnsWrapper>
        <Button onClick={() => setWantToDelete('clean')}>Clean</Button>
        <Button onClick={() => setWantToDelete('delete')}>Delete</Button>
      </$CleanUpBtnsWrapper>
      <DeleteConfirmationDialog
        dialogTitle={`${wantToDelete}`}
        showDialog={wantToDelete !== undefined}
        deleting={wantToDelete === 'clean' ? 'all list items' : `this list`}
        labelledBy={`${wantToDelete}-list-dialog`}
        onReject={() => {
          setWantToDelete(undefined)
        }}
        onAccept={async () => {
          await mutateAsync({
            listNameFn: listName,
            userIdFn: userData.userId,
            cleanUpType: wantToDelete,
          })
        }}
      />
    </>
  )
}

function Item({
  item,
  listName,
  setResponse,
}: {
  item: GroceryItemType
  listName: string
  setResponse: React.Dispatch<React.SetStateAction<MyResponseType>>
}) {
  const [isDone, setDone] = React.useState(item.isDone)
  const [isPending, setPending] = React.useState(false)

  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async ({
      list,
      itemName,
      data,
    }: {
      list: string
      itemName: string
      data: {isDone: boolean}
    }) => {
      const response = await postTwoLevelDeep<typeof data>({
        collection: 'grocery',
        doc: 'groceryList',
        subCollection: list,
        subDoc: spacefy(itemName, {reverse: true}),
        data,
        merge: true,
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
  return (
    <$ItemContainer isDone={isDone}>
      <$Item style={{flex: 1}} isDone={isDone}>
        {item.quantity && item.quantity} {item.name}
      </$Item>
      <Button
        onClick={async () => {
          setPending(!isPending)
          await mutateAsync({
            list: listName,
            itemName: item.name,
            data: {isDone: !isDone},
          })
          setDone(!isDone)
          setPending(!isPending)
        }}
        style={{width: '50px'}}
        variant="outlined"
        disabled={isPending}
      >
        {isPending ? (
          <Spinner mount={isPending} styling={{position: 'relative'}} />
        ) : (
          '✔'
        )}
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
        subDoc: spacefy(itemName, {reverse: true}),
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
  return (
    <$ItemsContainer>
      <Spinner
        mount={isFetching || isLoading}
        styling={{marginTop: '-98px', marginLeft: '-190px'}}
      />
      {!isLoading &&
        groceries?.map(item => {
          return (
            <DeleteFromDB
              dialogTitle="Delete item from list"
              key={nanoid()}
              deleteFn={() => deleteItem(spacefy(item.name, {reverse: true}))}
              dialogDeleting={item.name}
              dialogLabelledBy="delete-from-grocery-list"
            >
              <Item item={item} listName={listName} setResponse={setResponse} />
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

  if (!userData) {
    return (
      <$Warning>
        {errorST
          ? errorST.message
          : 'Something went wrong! Please SignIn again.'}
      </$Warning>
    )
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
      {errorST && <$Warning>{errorST.message}</$Warning>}
      {userData.listName.map((item, i) => {
        const listName = spacefy(item, {reverse: true})
        return (
          <div
            key={i}
            style={{
              margin: '30px 0',
            }}
          >
            <ListCleanUp
              listName={listName}
              userData={userData}
              setError={setError}
            />
            <ListName index={i} user={userData} />
            <Items listName={listName} />
            <AddStuff listName={listName} />
          </div>
        )
      })}
    </>
  )
}
export default Grocery
