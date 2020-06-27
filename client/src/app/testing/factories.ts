import * as faker from 'faker'; 
import { User } from '../services/auth.service';

export class UserFactory {
  // changed
  static create(data?: object): User {
    return User.create(Object.assign({
      id: faker.random.number(),
      username: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName()
    }, data));
  }
}