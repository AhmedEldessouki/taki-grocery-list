/* eslint-disable no-param-reassign */
import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import {useMutation, useQueryClient} from 'react-query'
import styled from '@emotion/styled'
import {nanoid} from 'nanoid'
import {postOneLevelDeep} from '../../lib/post'
import type {MyResponseType} from '../../../types/api'
import notify from '../../lib/notify'
import {$Warning} from '../../shared/utils'
import Spinner from '../spinner'
import whiteSpaceCleaner from '../../lib/whiteSpaceCleaner'
import $Field from './sharedCss/field'
import Button from '../button'

function ListInput({
  componentName,
  handleBlur,
  idx,
}: {
  componentName: string
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  idx: number
}) {
  const [state, setState] = React.useState('')

  return (
    <$Field>
      <input
        placeholder="this is to help control label"
        type="text"
        name={`list${idx}`}
        value={state}
        onChange={e => setState(e.target.value)}
        onBlur={handleBlur}
        id={`list${idx}`}
      />
      <label htmlFor={`list${idx}`}>{componentName} list</label>
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
  componentName,
  userId,
  listArray,
  oldList,
  setArrayChange,
}: {
  componentName: string
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

      if (listArray[listArray.length - 1] === '') {
        // This Is for bypassing on enter submit because
        // the value of Inputs is being set onBlur
        return
      }
      if (
        oldList.find(oldItem => listArray.find(newItem => newItem === oldItem))
      ) {
        setResponse({error: {message: 'List Already Exists.'} as Error})
        return
      }

      setPending(true)

      const newList = new Set([...oldList, ...listArray])
      await mutateAsync({
        listName: [...(newList as unknown as string[])],
      })

      setPending(false)

      if (responseST.error) {
        notify('❌', `Update Failed!`, {
          color: 'var(--red)',
        })
        setPending(false)
        return
      }
      notify('✔', `List Name Updated!`, {
        color: 'var(--green)',
      })
      setPending(false)
    },
    [listArray, mutateAsync, oldList, responseST.error],
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
            Add {componentName} list
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
                key={nanoid()}
                idx={i}
                handleBlur={e => {
                  listArray[i] = whiteSpaceCleaner(e.target.value.toLowerCase())
                  setArrayChange([...listArray])
                }}
                componentName={componentName}
              />
            )
          })}
          <$NoteContainer>
            <span>✖ Name should be unique.</span>
            <span>✖ Max of 3 lists per user.</span>
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
              'Submit'
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
