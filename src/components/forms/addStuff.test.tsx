import React from 'react'
import {GroceryItemType} from '../../../types/api'
import UserDataType from '../../../types/user'
import {generateGroceryItem} from '../../test/groceryDB'
import generateUserData from '../../test/userDB'
import {render, screen, userEvent} from '../../test/utils'
import AddStuff from './addStuff'

const user: UserDataType = generateUserData()
const item: GroceryItemType = generateGroceryItem()
const itemTwo: GroceryItemType = generateGroceryItem()

test('render without Items - [Create]', async () => {
  await render(<AddStuff idx={0} listName={user.listName[0]} />)
  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue('0')
  userEvent.type(screen.getByLabelText(/qty/i), `${item.quantity}`)
  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue(`0${item.quantity}`)

  expect(screen.getByLabelText(/new grocery item/i)).toHaveDisplayValue('')
  userEvent.type(screen.getByLabelText(/new grocery item/i), item.name)
  expect(screen.getByLabelText(/new grocery item/i)).toHaveDisplayValue(
    item.name,
  )

  expect(screen.getByLabelText(/priority no/i)).toHaveDisplayValue('0')
  userEvent.type(screen.getByLabelText(/priority no/i), `${item.priority}`)
  expect(screen.getByLabelText(/priority no/i)).toHaveDisplayValue(
    `0${item.priority}`,
  )

  expect(screen.getByTestId('transparent')).toBeInTheDocument()
  expect(screen.getByTestId('mattBlue')).toBeInTheDocument()
  expect(screen.getByTestId('mattRed')).toBeInTheDocument()
  expect(screen.getByTestId('mattGray')).toBeInTheDocument()
  expect(
    screen.getByRole('button', {
      name: /add item/i,
    }),
  ).toHaveAttribute('type', 'submit')
})

test('render with Items - [Edit]', async () => {
  await render(
    <AddStuff
      idx={0}
      listName={user.listName[0]}
      isEdit
      itemNameE={item.name}
      itemBgColorE={item.bgColor}
      itemQuantityE={item.quantity}
      itemPriorityE={item.priority}
      itemIsDoneE={item.isDone}
    />,
  )
  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue(`${item.quantity}`)
  expect(screen.getByLabelText(/new grocery item/i)).toHaveDisplayValue(
    item.name,
  )
  expect(screen.getByLabelText(/priority no/i)).toHaveDisplayValue(
    `${item.priority}`,
  )
})

test('render with Items and edit value - [Edit]', async () => {
  await render(
    <AddStuff
      idx={0}
      listName={user.listName[0]}
      isEdit
      itemNameE={item.name}
      itemBgColorE={item.bgColor}
      itemQuantityE={item.quantity}
      itemPriorityE={item.priority}
      itemIsDoneE={item.isDone}
    />,
  )

  userEvent.clear(screen.getByLabelText(/qty/i))
  userEvent.type(screen.getByLabelText(/qty/i), `${itemTwo.quantity}`)
  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue(
    `${itemTwo.quantity}`,
  )

  userEvent.clear(screen.getByLabelText(/new grocery item/i))
  userEvent.type(screen.getByLabelText(/new grocery item/i), itemTwo.name)
  expect(screen.getByLabelText(/new grocery item/i)).toHaveDisplayValue(
    itemTwo.name,
  )

  userEvent.clear(screen.getByLabelText(/priority no/i))
  userEvent.type(screen.getByLabelText(/priority no/i), `${itemTwo.priority}`)
  expect(screen.getByLabelText(/priority no/i)).toHaveDisplayValue(
    `${itemTwo.priority}`,
  )
})
