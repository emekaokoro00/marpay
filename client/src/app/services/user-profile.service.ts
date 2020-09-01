import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './auth.service';


export class UserSearchResponse {
	constructor(
	    public exists?: boolean
	) {}
}


export class PasswordUser {
	constructor(
    public old_password?: string,
    public new_password1?: string,
    public new_password2?: string,
	) {}
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
  private passwordUser = new PasswordUser();

  constructor(
    private http: HttpClient
  ) {}

  getUser(id: number): Observable<User> {
    const url = `/api/myuser/${id}/`;
    return this.http.get<User>(url).pipe(
      tap(_ => console.log(`fetched user id=${id}`))
    );
  }

  // for checking if username exists
  get_by_username(username: string): Observable<UserSearchResponse> {
    const url = `/api/myuser/get_by_username/${username}/`;
    return this.http.get(url)
       .pipe(
	        map(res => { if (res) { return res; } } )
       );
  }

  change_password(user: User, oldPassword: string, newPassword1: string, newPassword2: string): Observable<User> {
    const url = `/api/myuser/${user.id}/change_password/`;
    
    this.passwordUser.old_password = oldPassword;
    this.passwordUser.new_password1 = newPassword1;
    this.passwordUser.new_password2 = newPassword2;

    return this.http.put<User>(url, JSON.stringify(this.passwordUser), this.httpOptions)
      .pipe(
        
       );
  }

  updateUser(user: User): Observable<User> {
    const url = `/api/myuser/${user.id}/`;

    // return this.http.put<User>(url, JSON.stringify(user), this.httpOptions).pipe( // for django_GenericAPIView
    return this.http.patch<User>(url, JSON.stringify(user), this.httpOptions).pipe( // for django_ModelViewSet
      tap(updated_user => localStorage.setItem('marpay.user', JSON.stringify(updated_user))
         )
    );
  }

}
