import React from 'react'
import {GroceryItemType} from '../../../types/api'
import UserDataType from '../../../types/user'
import {generateGroceryItem} from '../../test/groceryDB'
import generateUserData from '../../test/userDB'
import {render, screen, userEvent} from '../../test/utils'
import AddStuff from './addStuff'
import EditItem from './editItem'

const user: UserDataType = generateUserData()
const item: GroceryItemType = generateGroceryItem()
const itemTwo: GroceryItemType = generateGroceryItem()

test('render EditItem: check that the Edit Form is not visible', async () => {
  await render(
    <EditItem>
      <AddStuff
        idx={0}
        listName={user.listName[0]}
        isEdit
        itemNameE={item.name}
        itemBgColorE={item.bgColor}
        itemQuantityE={item.quantity}
        itemPriorityE={item.priority}
        itemIsDoneE={item.isDone}
      />
      ,
    </EditItem>,
  )
  expect(screen.queryByLabelText(/qty/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText('name')).not.toBeInTheDocument()

  expect(screen.getByLabelText(/click to edit item/i)).toBeInTheDocument()
})

test("render EditItem: Edit Form's values", async () => {
  await render(
    <EditItem>
      <AddStuff
        idx={0}
        listName={user.listName[0]}
        isEdit
        itemNameE={item.name}
        itemBgColorE={item.bgColor}
        itemQuantityE={item.quantity}
        itemPriorityE={item.priority}
        itemIsDoneE={item.isDone}
      />
      ,
    </EditItem>,
  )

  userEvent.click(screen.getByLabelText(/click to edit item/i))

  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue(`${item.quantity}`)
  userEvent.clear(screen.getByLabelText(/qty/i))
  userEvent.type(screen.getByLabelText(/qty/i), `${itemTwo.quantity}`)
  expect(screen.getByLabelText(/qty/i)).toHaveDisplayValue(
    `${itemTwo.quantity}`,
  )

  expect(screen.getByLabelText('name')).toHaveDisplayValue(item.name)
  userEvent.clear(screen.getByLabelText('name'))
  userEvent.type(screen.getByLabelText('name'), itemTwo.name)
  expect(screen.getByLabelText('name')).toHaveDisplayValue(itemTwo.name)
})
