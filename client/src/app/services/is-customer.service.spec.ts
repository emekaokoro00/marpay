import { TestBed } from '@angular/core/testing';
import { IsCustomer } from './is-customer.service';
import { UserFactory } from '../testing/factories'


describe('IsCustomer', () => {

  it('should allow a customer to access a route', () => {
    const isCustomer: IsCustomer = new IsCustomer();
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create({current_role: 'customer'})
    ));
    expect(isCustomer.canActivate()).toBeTruthy();
  });

  it('should not allow a telehealthworker to access a route', () => {
    const isCustomer: IsCustomer = new IsCustomer();
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create({current_role: 'telehealthworker'})
    ));
    expect(isCustomer.canActivate()).toBeFalsy();
  });

  it('should not allow a physician to access a route', () => {
    const isCustomer: IsCustomer = new IsCustomer();
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create({current_role: 'physician'})
    ));
    expect(isCustomer.canActivate()).toBeFalsy();
  });

});