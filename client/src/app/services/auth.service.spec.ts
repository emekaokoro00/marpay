import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController 
} from '@angular/common/http/testing';

import { AuthService, User } from './auth.service';
import { UserFactory } from '../testing/factories';

describe('Authentication using a service', () => {
	let authService: AuthService;
	let httpMock: HttpTestingController;
	beforeEach(() => {
	  TestBed.configureTestingModule({
	    imports: [ HttpClientTestingModule ],
	    providers: [ AuthService ]
	  });
	  authService = TestBed.get(AuthService);
	  httpMock = TestBed.get(HttpTestingController);
	});

	afterEach(() => {
	  httpMock.verify();
	});

	it('should allow a user to sign up for a new account', () => {
	  // Set up the data.
	  const userData = UserFactory.create();
	 
	  // Execute the function under test.
	  authService.signUp(
	    userData.username,
	    userData.first_name,
	    userData.last_name,
	    'pAssw0rd!',
	    userData.current_group,
	    userData.current_role
	  ).subscribe(user => {
	    expect(user).toBe(userData);
	  });

	  const request = httpMock.expectOne('/api/sign_up/');
	    request.flush(userData);
	});

	it('should allow a user to log in to an existing account', () => {
	  // Set up the data.
	  const userData = UserFactory.create();
	  // A successful login should write data to local storage.
	  localStorage.clear();
	  // Execute the function under test.
	  authService.logIn(
	    userData.username, 'pAssw0rd!'
	  ).subscribe(user => {
	    expect(user).toBe(userData);
	  });
	  const request = httpMock.expectOne('/api/log_in/');
	  request.flush(userData);
	  // Confirm that the expected data was written to local storage.
	  expect(localStorage.getItem('marpay.user')).toBe(JSON.stringify(userData));
	});

	it('should allow a user to log out', () => {
	  // Set up the data.
	  const userData = {};
	  // A successful logout should delete local storage data.
	  localStorage.setItem('marpay.user', JSON.stringify({}));
	  // Execute the function under test.
	  authService.logOut().subscribe(user => {
	    expect(user).toEqual(userData);
	  });
	  const request = httpMock.expectOne('/api/log_out/');
	  request.flush(userData);
	  // Confirm that the local storage data was deleted.
	  expect(localStorage.getItem('marpay.user')).toBeNull();
	});

	it('should determine whether a user is logged in', () => {
	  localStorage.clear();
	  expect(User.getUser()).toBeFalsy();
	  localStorage.setItem('marpay.user', JSON.stringify(
	    UserFactory.create()
	  ));
	  expect(User.getUser()).toBeTruthy();
	});

});
