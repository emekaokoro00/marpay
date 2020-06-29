import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export class User {
	constructor(
	    public id?: number,
	    public username?: string,
	    public first_name?: string,
	    public last_name?: string,
	    public current_role?: string
	) {}

	static create(data: any): User {
	    return new User(
	      data.id,
	      data.username,
	      data.first_name,
	      data.last_name,
      	      data.current_role
	    );
	}

	static getUser(): User {
	  const userData = localStorage.getItem('marpay.user');
	  if (userData) {
	    return User.create(JSON.parse(userData));
	  }
	  return null;
	}

	static isCustomer(): boolean {
	  const user = User.getUser();
	  if (user === null) {
	    return false;
	  }
	  // return true;
	  return user.current_role === 'customer';
	}

	static isTelehealthworker(): boolean {
	  const user = User.getUser();
	  if (user === null) {
	    return false;
	  }
	  return user.current_role === 'telehealthworker';
	}

	static isPhysician(): boolean {
	  const user = User.getUser();
	  if (user === null) {
	    return false;
	  }
	  return user.current_role === 'physician';
	}
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient) {}

	signUp(
	    username: string,
	    firstName: string,
	    lastName: string,
	    password: string,
	    current_role: string
	  ): Observable<User> {
	    const url = '/api/sign_up/';
	    const formData = new FormData();
	    formData.append('username', username);
	    formData.append('first_name', firstName);
	    formData.append('last_name', lastName);
	    formData.append('password1', password);
	    formData.append('password2', password);
	    formData.append('current_role', current_role);
	    return this.http.request<User>('POST', url, {body: formData});
	}

	logIn(username: string, password: string): Observable<User> {
	  const url = '/api/log_in/';
	  return this.http.post<User>(url, {username, password}).pipe(
	    tap(user => localStorage.setItem('marpay.user', JSON.stringify(user)))
	  );
	}

	logOut(): Observable<any> {
	  const url = '/api/log_out/';
	  return this.http.post(url, null).pipe(
	    finalize(() => localStorage.removeItem('marpay.user'))
	  );
	}
}
