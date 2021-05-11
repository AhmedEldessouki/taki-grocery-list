import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import {nanoid} from 'nanoid'
import React from 'react'
import {mqMax} from '../shared/utils'
import DeleteFromDB from './deleteFromDB'

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
color: var(--lightGray);
`}
`
function Item({item}: {item: string}) {
  const [isDone, setDone] = React.useState(false)

  return (
    <$ItemContainer isDone={isDone}>
      <$Item isDone={isDone}>{item}</$Item>
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
function Items({data}: {data: Array<string>}) {
  async function deleteItem() {}

  return (
    <$ItemsContainer>
      {data.map(item => {
        return (
          <DeleteFromDB
            key={nanoid()}
            deleteFn={deleteItem}
            dialogDeleting={item}
            dialogLabelledBy="delete-from-grocery-list"
          >
            <Item item={item} />
          </DeleteFromDB>
        )
      })}
    </$ItemsContainer>
  )
}

export default Items
