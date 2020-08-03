import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './auth.service';



class UserToSave {
  constructor(
    public first_name?: string,
    public last_name?: string,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  userToSave: UserToSave = new UserToSave();

  private httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}

  constructor(
    private http: HttpClient
  ) {}

  getUser(id: number): Observable<User> {
    const url = `/api/myuser/${id}/`;
    return this.http.get<User>(url).pipe(
      tap(_ => console.log(`fetched user id=${id}`))
    );
  }

  updateUser(id: number, firstName: string, lastName: string): Observable<User> {
    const url = `/api/myuser/${id}/update/`;

    this.userToSave.first_name = firstName;
    this.userToSave.last_name = lastName;
    console.log(JSON.stringify(this.userToSave));

    return this.http.put<User>(url, JSON.stringify(this.userToSave), this.httpOptions).pipe(
      tap(_ => 
         console.log(`updated hero id=${id}`)
         )
    );
  }

}
