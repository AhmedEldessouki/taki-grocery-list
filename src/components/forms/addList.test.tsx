import React from 'react'
import UserDataType from '../../../types/user'
import {generateListName} from '../../test/groceryDB'
import generateUserData from '../../test/userDB'
import {render, screen, userEvent} from '../../test/utils'
import AddList from './addList'

const user: UserDataType = generateUserData()

function MyWrapper() {
  const [listArray, setListArray] = React.useState<Array<string>>([])
  return (
    <AddList
      componentName="grocery"
      userId={user.userId}
      oldList={user.listName}
      setArrayChange={setListArray}
      listArray={listArray}
    />
  )
}

test('Adding the first Input:: User has lest than 3 lists', async () => {
  await render(<MyWrapper />)
  expect(screen.getByText(/grocery/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Add/i))
  expect(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
  ).toBeInTheDocument()
})

test('should fail to add 3rd input:: User has 3 lists', async () => {
  await render(<MyWrapper />)
  userEvent.click(screen.getByText(/Add grocery list/i))
  userEvent.click(screen.getByText(/Add grocery list/i))

  expect(screen.getAllByRole('textbox')).toHaveLength(2)

  expect(
    screen.getByRole('button', {
      name: /add grocery list/i,
    }),
  ).toBeDisabled()
})

test('typing in input', async () => {
  await render(<MyWrapper />)
  userEvent.click(screen.getByText(/Add grocery list/i))

  expect(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
  ).toBeInTheDocument()

  const someListName = generateListName()
  userEvent.type(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
    someListName,
  )

  expect(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
  ).toHaveDisplayValue(someListName)
})

test('Input extra white space cleaning', async () => {
  let listArray: string[] = []
  const setListArray = (arr: string[]) => {
    listArray = arr
  }
  // The ListArray is receiving an array with 1 empty string because after clicking
  // on Add btn component will not update unless something else happens that updates the component
  // so we lie to component from the start and after executing "setListArray" we check if it got cleaned or not
  await render(
    <AddList
      componentName="grocery"
      userId={user.userId}
      oldList={user.listName}
      setArrayChange={
        setListArray as React.Dispatch<React.SetStateAction<string[]>>
      }
      listArray={['']}
    />,
  )

  userEvent.click(screen.getByText(/Add grocery list/i))

  expect(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
  ).toBeInTheDocument()

  const someCleanListName = generateListName()
  const someListName = `                      ${someCleanListName}          + daad +                                    `

  userEvent.type(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
    someListName,
  )

  expect(
    screen.getByRole('textbox', {
      name: /grocery list/i,
    }),
  ).toHaveDisplayValue(someListName)

  userEvent.click(
    screen.getByRole('button', {
      name: /submit/i,
    }),
  )
  expect(listArray).toContain(`${someCleanListName.toLowerCase()} + daad +`)
})
