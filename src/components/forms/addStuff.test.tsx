import React from 'react'
import {GroceryItemType} from '../../../types/api'
import {UserDataType} from '../../../types/user'
import {generateGroceryItem} from '../../test/groceryDB'
import {generateUserData} from '../../test/userDB'
import {render, screen, userEvent} from '../../test/utils'
import AddStuff from './addStuff'

const user: UserDataType = generateUserData()
const item: GroceryItemType = generateGroceryItem()

// await render( <AddStuff
//   idx={0}
//   listName={user.listName[0]}
//   isEdit={false}
//   item={generateGroceryItem()}
// />)

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
    <AddStuff idx={0} listName={user.listName[0]} isEdit={true} item={item} />,
  )
  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue(`${item.quantity}`)
  expect(screen.getByLabelText(/new grocery item/i)).toHaveDisplayValue(
    item.name,
  )
  expect(screen.getByLabelText(/priority no/i)).toHaveDisplayValue(
    `${item.priority}`,
  )
})
