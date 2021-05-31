import faker from 'faker'
import type {UserDataType} from '../../types/user'

function generateUserData(): UserDataType {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    userId: faker.datatype.uuid(),
    listName: [faker.random.words()],
    email: faker.internet.email(),
  }
}

export {generateUserData}
