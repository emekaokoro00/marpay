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
      current_group: 'customer',
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
      session_address: faker.address.streetAddress(),
      session_address_for_telehealthworker: faker.address.streetAddress(),
      status: 'REQUESTED',
      status_to_physician: 'REQUESTED',
      session_reason: 'reason',
      session_customer: UserFactory.create(),
      session_telehealthworker: UserFactory.create({current_group: 'telehealthworker'})
    }, data));
  }
}