/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import {nanoid} from 'nanoid'
import React from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import type {GroceryItemType, MyResponseType} from '../../types/api'
import type UserDataType from '../../types/user'
import {deleteTwoLevelDeep} from '../lib/delete'
import {getOneLevelDeepDoc, getTwoLevelDeep} from '../lib/get'
import spacefy from '../lib/spacefy'
import {$Warning, mqMax} from '../shared/utils'
import {postTwoLevelDeep} from '../lib/post'
import {db} from '../lib/firebase'
import DeleteFromDB from './deleteFromDB'
import Spinner from './spinner'
import DeleteConfirmationDialog from './deleteConfirmationDialog'

const AddList = React.lazy(() => import('./forms/addList'))
const AddStuff = React.lazy(() => import('./forms/addStuff'))
const ListName = React.lazy(() => import('./forms/listName'))
const EditItem = React.lazy(() => import('./forms/editItem'))

// Will move the buttons into items and extract them to another file. then lazy load... also will do suspense List

const $Item = styled.span<{isDone: boolean}>`
  font-size: larger;
  text-transform: capitalize;
  ${({isDone}) =>
    isDone &&
    `
text-decoration-line: line-through;
`}
`
const $ItemContainer = styled.div<{isDone: boolean; bgColor: string}>`
  display: flex;
  align-items: center;
  width: 500px;
  padding: 5px 10px;
  border-radius: var(--roundness);
  ${mqMax.s} {
    width: 300px;
  }
  ${mqMax.xs} {
    width: 250px;
  }
  ${({isDone, bgColor}) =>
    `
  background: ${isDone ? `transparent` : `var(--${bgColor})`};
  ${
    isDone &&
    `
    background-image: linear-gradient(to right, #000, #393939, #717171, #afafaf, #f1f1f1);
    color: var(--white);
`
  };
`}
`
const $CleanUpBtnsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

function ListCleanUp({
  listName,
  userID,
  userLists,
  setError,
}: {
  listName: string
  userID: string
  userLists: string[]
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
        const index = userLists.indexOf(spacefy(listNameFn))
        if (index >= 0) {
          userLists.splice(index, 1)
          batch.update(userRef, {listName: userLists})
        }
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
            userIdFn: userID,
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
      deleteX,
      list,
      itemName,
      data,
    }:
      | {
          deleteX: false
          list: string
          itemName: string
          data: {isDone: boolean}
        }
      | {deleteX: true; list: string; itemName: string; data?: unknown}) => {
      if (deleteX) {
        const response = await deleteTwoLevelDeep({
          collection: 'grocery',
          doc: 'groceryList',
          subCollection: list,
          subDoc: spacefy(itemName, {reverse: true}),
        })
        setResponse({...response})
      } else {
        const response = await postTwoLevelDeep<typeof data>({
          collection: 'grocery',
          doc: 'groceryList',
          subCollection: list,
          subDoc: spacefy(itemName, {reverse: true}),
          data,
          merge: true,
        })
        setResponse({...response})
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(listName)
      },
    },
  )
  async function deleteItem(itemName: string) {
    await mutateAsync({
      deleteX: true,
      list: spacefy(listName, {reverse: true}),
      itemName,
    })
  }
  return (
    <$ItemContainer isDone={isDone} bgColor={item.bgColor}>
      <$Item style={{flex: 1}} isDone={isDone}>
        {item.quantity && item.quantity} {item.name}
      </$Item>
      <React.Suspense fallback={<Spinner size={40} mount />}>
        <EditItem>
          <React.Suspense fallback={<Spinner size={40} mount />}>
            <AddStuff idx={124} isEdit listName={listName} item={item} />
          </React.Suspense>
        </EditItem>
      </React.Suspense>
      <Button
        onClick={async () => {
          setPending(!isPending)
          await mutateAsync({
            deleteX: false,
            list: listName,
            itemName: item.name,
            data: {isDone: !isDone},
          })
          setDone(!isDone)
          setPending(!isPending)
        }}
        style={{color: 'var(--black)', padding: 0}}
        variant="text"
        disabled={isPending}
      >
        {isPending ? (
          <Spinner
            mount={isPending}
            size={30}
            styling={{position: 'relative'}}
          />
        ) : (
          '✔'
        )}
      </Button>
      <DeleteFromDB
        dialogTitle="Delete item from list"
        key={nanoid()}
        deleteFn={() => deleteItem(spacefy(item.name, {reverse: true}))}
        dialogDeleting={item.name}
        dialogLabelledBy="delete-from-grocery-list"
      />
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

  const reArrangeItems = React.useCallback(
    (arr: Array<GroceryItemType>): Array<GroceryItemType> =>
      arr.sort((a, b) => {
        if (a.priority < 1) {
          a.priority = 9999
        }
        if (b.priority < 1) {
          b.priority = 9999
        }
        return a.priority - b.priority
      }),
    [],
  )

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
        groceries &&
        reArrangeItems(groceries).map(item => (
          <Item item={item} listName={listName} setResponse={setResponse} />
        ))}
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

  return (
    <>
      <Spinner
        mount={isFetching || isLoading}
        styling={{marginTop: '10px', left: '10px'}}
      />
      <React.Suspense fallback={<Spinner size={40} mount />}>
        <AddList
          userId={userData?.userId ?? ''}
          setArrayChange={setArray}
          oldList={userData?.listName ?? ['']}
          componentName="grocery"
          listArray={arrayST}
        />
      </React.Suspense>
      {errorST && <$Warning>{errorST.message}</$Warning>}
      {userData?.listName.map((item, i) => {
        const listName = spacefy(item, {reverse: true})
        return (
          <div
            key={nanoid()}
            style={{
              margin: '30px 0',
            }}
          >
            <ListCleanUp
              listName={listName}
              userID={userData.userId}
              userLists={userData.listName}
              setError={setError}
            />
            {isFetching ? (
              // The Height is to prevent the layout shifting
              <div style={{height: '80px'}}>
                <Spinner mount={isFetching} styling={{position: 'relative'}} />
              </div>
            ) : (
              <React.Suspense fallback={<Spinner size={40} mount />}>
                <ListName
                  index={i}
                  userID={userData.userId}
                  userLists={userData.listName}
                />
              </React.Suspense>
            )}
            <Items listName={listName} />
            <React.Suspense fallback={<Spinner size={40} mount />}>
              <AddStuff listName={listName} idx={i} />
            </React.Suspense>
          </div>
        )
      })}
    </>
  )
}
export default Grocery
