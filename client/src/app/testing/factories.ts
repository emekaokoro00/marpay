import * as faker from 'faker'; 
import { User } from '../services/auth.service';
import { Medsession } from '../services/medsession.service'; // new

export class UserFactory {
  // changed
  static create(data?: object): User {
    return User.create(Object.assign({
      id: faker.random.number(),
      username: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      current_role: 'customer'
    }, data));
  }
}

export class MedsessionFactory {
  static create(data?: object): Medsession {
    return Medsession.create(Object.assign({
      id: faker.random.uuid(),
      created: faker.date.past(),
      updated: faker.date.past(),
      status: 'REQUESTED',
      session_customer: UserFactory.create(),
      session_telehealthworker: UserFactory.create({current_role: 'telehealthworker'})
    }, data));
  }
}