/* eslint-disable no-nested-ternary */
import faker from 'faker'
import type {GroceryItemType} from '../../types/api'

const groceries: Array<GroceryItemType> = []

function generateGroceryItem(): GroceryItemType {
  const priority = faker.datatype.number(3)
  const bgColor =
    priority === 0
      ? 'transparent'
      : priority === 1
      ? 'mattBlue'
      : priority === 2
      ? 'mattRed'
      : 'mattGray'
  return {
    name: faker.random.words(3),
    bgColor,
    priority,
    quantity: faker.datatype.number(100),
    isDone: faker.datatype.boolean(),
  }
}
function generateListName(): string {
  return faker.random.words()
}

export {generateGroceryItem, generateListName, groceries}
