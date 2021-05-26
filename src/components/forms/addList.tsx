import React from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import {useMutation, useQueryClient} from 'react-query'
import styled from '@emotion/styled'
import {postOneLevelDeep} from '../../lib/post'
import type {MyResponseType} from '../../../types/api'
import {notify} from '../../lib/notify'
import {$Warning} from '../../shared/utils'
import Spinner from '../spinner'
import {whiteSpaceCleaner} from '../../lib/whiteSpaceCleaner'
import {$Field} from './sharedCss/field'

function ListInput({
  componentName,
  handleBlur,
}: {
  componentName: string
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}) {
  const [state, setState] = React.useState('')

  return (
    <$Field>
      <input
        placeholder="this is to help control label"
        type="list"
        name="list"
        value={state}
        onChange={e => setState(e.target.value)}
        onBlur={handleBlur}
        id="list"
      />
      <label htmlFor="list">{componentName} list</label>
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
  #close-btn {
    position: absolute;
    margin-left: 10px;
    padding: 12px 13px;
    padding-top: 7px;
    font-size: 1rem;
    :hover {
      padding: 12px 13px;
      padding-top: 7px;
    }
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

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setResponse({error: undefined, isSuccessful: false})

    if (listArray[listArray.length - 1] === '') {
      // This Is for bypassing on enter submit because
      // the value of Inputs is being set onBlur
      return
    } else if (
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
  }

  React.useEffect(() => {
    if (oldList.length >= 3) {
      setShow(false)
      setArrayChange([])
    }
  }, [oldList, setArrayChange])

  const hasThreeItems = listArray.length + oldList.length > 3
  const isThreeItems = listArray.length + oldList.length >= 3
  return (
    <>
      <$BtnWrapper>
        <Button
          variant="outlined"
          disabled={isThreeItems}
          style={{background: 'transparent', color: 'var(--black)'}}
          onClick={() => {
            setArrayChange([...listArray.concat('')])
            if (!isShow) {
              setShow(!isShow)
            }
          }}
        >
          <AddIcon
            fontSize="large"
            aria-label={`add icon`}
            style={{paddingRight: '15px'}}
          />
          Add {componentName} list
        </Button>
        {isShow && (
          <IconButton
            id="close-btn"
            onClick={() => {
              setArrayChange([])
              setShow(!isShow)
            }}
            aria-label="close button"
          >
            ✖
          </IconButton>
        )}
      </$BtnWrapper>
      {isShow && (
        <$Form onSubmit={handleSubmit}>
          {listArray.map((item, i) => {
            if (oldList.length + i + 1 > 3) {
              return void 0
            } else {
              return (
                <ListInput
                  key={i}
                  handleBlur={e => {
                    listArray[i] = whiteSpaceCleaner(
                      e.target.value.toLowerCase(),
                    )
                    setArrayChange([...listArray])
                  }}
                  componentName={componentName}
                />
              )
            }
          })}
          <$NoteContainer>
            <span>✖ Name should be unique.</span>
            <span
              style={{
                color: hasThreeItems ? 'var(--red)' : 'inherit',
              }}
            >
              ✖ Max of 3 lists per user.
            </span>
          </$NoteContainer>
          {responseST.error && (
            <$Warning marginBottom="10">{responseST.error.message}</$Warning>
          )}
          <Button
            type="submit"
            variant="outlined"
            disabled={isPending || hasThreeItems}
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
      )}
    </>
  )
}

export default AddList
