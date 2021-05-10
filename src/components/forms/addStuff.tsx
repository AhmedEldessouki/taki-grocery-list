import styled from '@emotion/styled'
import {Button} from '@material-ui/core'
import React from 'react'
import {postOneLevelDeep} from '../../lib/post'
import {$Warning, mqMax} from '../../shared/utils'
import {$Field} from './sharedCss/field'

const $Form = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  width: 500px;
  ${mqMax.s} {
    width: 300px;
  }
  ${mqMax.xs} {
    width: 250px;
  }
`

function AddStuff() {
  const [isPending, setPending] = React.useState(false)
  const [submitFailed, setSubmitFailed] = React.useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    setPending(!isPending)
    if (submitFailed) {
      setSubmitFailed('')
    }

    const {item} = e.target as typeof e.target & {
      item: {value: string}
    }
    const formData = {
      add: item.value,
    }

    const {error} = await postOneLevelDeep({
      collection: 'grocery',
      data: formData,
    })
    if (error) {
      setSubmitFailed(error.message)
    }
    setPending(false)
  }
  return (
    <div>
      <$Form onSubmit={handleSubmit}>
        <$Field>
          <input
            type="text"
            name="item"
            id="item"
            placeholder="enter item"
            required
          />
          <label htmlFor="item">New Grocery Item</label>
        </$Field>
        <Button
          type="submit"
          variant="contained"
          style={{
            background: !isPending ? 'var(--green)' : 'var(--red)',
            color: 'var(--lightGray)',
            minWidth: '88px',
          }}
        >
          Add Item
        </Button>
      </$Form>
      {submitFailed && (
        <$Warning role="alert" marginBottom="10">
          {submitFailed}
        </$Warning>
      )}
    </div>
  )
}

export default AddStuff
