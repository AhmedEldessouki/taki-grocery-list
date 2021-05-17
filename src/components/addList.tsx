import React from 'react'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import {useMutation, useQueryClient} from 'react-query'
import styled from '@emotion/styled'
import {postOneLevelDeep} from '../lib/post'
import type {MyResponseType} from '../../types/api'
import {useAuth} from '../context/auth'
import {notify} from '../lib/notify'
import {$Field} from './forms/sharedCss/field'

function ListInput({
  listName,
  handleBlur,
}: {
  listName: string
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
      <label htmlFor="list">{listName} list</label>
    </$Field>
  )
}

const $Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
`

function NewList({
  listName,
  listArray,
  oldList,
  setArrayChange,
}: {
  listName: string
  listArray: string[]
  oldList: string[]
  setArrayChange: React.Dispatch<React.SetStateAction<Array<string>>>
}) {
  const {user} = useAuth()
  const [isPending, setPending] = React.useState(false)
  const [responseST, setResponse] = React.useState<MyResponseType>({
    error: undefined,
    isSuccessful: false,
  })

  const queryClient = useQueryClient()
  const {mutateAsync} = useMutation(
    async (newData: unknown) => {
      const response = await postOneLevelDeep<unknown>({
        collection: 'users',
        doc: user?.uid,
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
    setPending(true)

    const newList = new Set(listArray)
    console.log(newList, [...(newList as unknown as string[])])
    await mutateAsync({
      listName: [...oldList, ...(newList as unknown as string[])],
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
  return (
    <>
      <div style={{margin: '5px auto'}}>
        <Button
          variant="outlined"
          style={{background: 'transparent', color: 'var(--black)'}}
          onClick={() => setArrayChange([...listArray.concat('')])}
        >
          <AddIcon
            fontSize="large"
            aria-label={`add icon`}
            style={{paddingRight: '15px'}}
          />
          Add {listName} list
        </Button>
      </div>
      {listArray.length > 0 && (
        <$Form onSubmit={handleSubmit}>
          {listArray.map((item, i) => {
            return (
              <ListInput
                key={i}
                handleBlur={e => {
                  listArray[i] = e.target.value
                  setArrayChange([...listArray])
                }}
                listName={listName}
              />
            )
          })}
          <Button
            type="submit"
            variant="outlined"
            style={{
              background: !isPending ? 'var(--green)' : 'var(--red)',
              color: 'var(--white)',
              margin: '20px 0',
            }}
          >
            Submit
          </Button>
        </$Form>
      )}
    </>
  )
}

export default NewList
