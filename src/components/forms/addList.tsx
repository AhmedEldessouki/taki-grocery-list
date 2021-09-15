/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import {useMutation, useQueryClient} from 'react-query'
import styled from '@emotion/styled'
import {FormattedMessage} from 'react-intl'
import {postOneLevelDeep} from '../../lib/post'
import type {MyResponseType} from '../../../types/api'
import notify from '../../lib/notify'
import {$Warning} from '../../shared/utils'
import Spinner from '../spinner'
import whiteSpaceCleaner from '../../lib/whiteSpaceCleaner'
import $Field from './sharedCss/field'
import Button from '../button'

function ListInput({
  idx,
  ...overRide
}: {
  idx: number
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <$Field>
      <input
        placeholder="this is to help control label"
        type="text"
        name={`list${idx}`}
        id={`list${idx}`}
        {...overRide}
      />
      <label htmlFor={`list${idx}`}>
        <FormattedMessage id="addList.new" defaultMessage="Submit" />
      </label>
    </$Field>
  )
}

const $Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`
const $NoteContainer = styled.div`
  color: var(--gray);
  display: flex;
  flex-direction: column;
  span {
    font-size: 14px;
    line-height: 2;
  }
`
const $BtnWrapper = styled.div`
  margin: 5px auto;
  padding-right: 3rem;
  #close-btn {
    position: absolute;
    margin-left: 210px;
    margin-top: -40px;
  }
`
function AddList({
  userId,
  listArray,
  oldList,
  setArrayChange,
}: {
  userId: string
  listArray: string[]
  oldList: string[]
  setArrayChange: React.Dispatch<React.SetStateAction<Array<string>>>
}) {
  const [isPending, setPending] = React.useState(false)
  const [isShow, setShow] = React.useState(false)
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async (newData: unknown) => {
      const response = await postOneLevelDeep<unknown>({
        collection: 'users',
        doc: userId,
        data: newData,
        merge: true,
      })
      // THIS IS A BLUFF ... Not Sure IF It Will [[[WORK]]]
      setResponse({...response})
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user')
      },
    },
  )

  const handleSubmit = React.useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      setResponse({error: undefined, isSuccessful: false})

      const newInputList = listArray.map(inputVal =>
        whiteSpaceCleaner(inputVal.toLowerCase()),
      )

      if (
        oldList.find(oldItem =>
          newInputList.find(newItem => newItem === oldItem),
        )
      ) {
        setResponse({error: {message: 'List Already Exists.'} as Error})
        return
      }

      setPending(true)

      const newList = new Set([...oldList, ...newInputList])
      await mutateAsync({
        listName: [...(newList as unknown as string[])],
      })

      setPending(false)

      if (responseST.error) {
        notify('❌', `Lists Update Failed!`, {
          color: 'var(--red)',
        })
        setPending(false)
        return
      }

      notify('✔', `Lists Updated Succeeded!`, {
        color: 'var(--green)',
      })
      if (newList.size < 3) {
        setArrayChange([''])
      }
      setPending(false)
    },
    [listArray, mutateAsync, oldList, responseST.error, setArrayChange],
  )

  React.useEffect(() => {
    if (oldList.length < 3) return
    setShow(false)
    setArrayChange([])
  }, [oldList, setArrayChange])

  return (
    <>
      <$BtnWrapper>
        <Button
          disabled={listArray.length + oldList.length >= 3}
          style={{background: 'transparent', color: 'var(--black)'}}
          onClick={() => {
            setArrayChange([...listArray.concat('')])
            if (!isShow) {
              setShow(!isShow)
            }
          }}
          type="button"
        >
          <>
            <AddIcon
              fontSize="large"
              aria-label="add icon"
              style={{paddingRight: '15px'}}
            />
            <FormattedMessage
              id="addList.add"
              defaultMessage="Add Grocery list"
            />
          </>
        </Button>
        {isShow && (
          <Button
            type="button"
            id="close-btn"
            onClick={() => {
              setArrayChange([])
              setShow(!isShow)
            }}
            aria-label="close button"
          >
            ✖
          </Button>
        )}
      </$BtnWrapper>
      {isShow ? (
        <$Form onSubmit={handleSubmit}>
          {listArray.map((item, i) => {
            if (oldList.length + i + 1 > 3) {
              return undefined
            }
            return (
              <ListInput
                // eslint-disable-next-line react/no-array-index-key
                key={`add_list_${i} item`}
                idx={i}
                value={listArray[i]}
                onChange={e => {
                  listArray[i] = e.target.value
                  setArrayChange([...listArray])
                }}
              />
            )
          })}
          <$NoteContainer>
            <span>
              ✖{' '}
              <FormattedMessage
                id="addList.check1"
                defaultMessage="Name should be unique"
              />
              .
            </span>
            <span>
              ✖{' '}
              <FormattedMessage
                id="addList.check2"
                defaultMessage="Max of 3 lists per user"
              />
              .
            </span>
          </$NoteContainer>
          {responseST.error && (
            <$Warning marginBottom="10">{responseST.error.message}</$Warning>
          )}
          <Button
            type="submit"
            disabled={isPending}
            style={{
              background: 'var(--green)',
              color: 'var(--white)',
              margin: '20px 0',
            }}
          >
            {isPending ? (
              <Spinner
                mount={isPending}
                size={28}
                styling={{
                  position: 'relative',
                  zIndex: 999999999999,
                  color: 'var(--white)',
                }}
              />
            ) : (
              <FormattedMessage id="submit" defaultMessage="Submit" />
            )}
          </Button>
        </$Form>
      ) : (
        <div />
      )}
    </>
  )
}

export default AddList
