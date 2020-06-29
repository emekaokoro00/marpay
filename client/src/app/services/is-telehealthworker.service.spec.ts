import { IsTelehealthworker } from './is-telehealthworker.service';
import { UserFactory } from '../testing/factories';


describe('IsTelehealthworker', () => {
  it('should allow a thw to access a route', () => {
    const isTelehealthworker: IsTelehealthworker = new IsTelehealthworker();
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create({current_role: 'telehealthworker'})
    ));
    expect(isTelehealthworker.canActivate()).toBeTruthy();
  });

  it('should not allow a non-thw to access a route', () => {
    const isTelehealthworker: IsTelehealthworker = new IsTelehealthworker();
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create({current_role: 'customer'})
    ));
    expect(isTelehealthworker.canActivate()).toBeFalsy();
  });
});
