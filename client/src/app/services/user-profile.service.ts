import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

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

  updateUser(user: User): Observable<User> {
    const url = `/api/myuser/${user.id}/`;
    // console.log(JSON.stringify(user));
    // return this.http.put<User>(url, JSON.stringify(user), this.httpOptions).pipe( // for django_GenericAPIView
    return this.http.patch<User>(url, JSON.stringify(user), this.httpOptions).pipe( // for django_ModelViewSet
      tap(updated_user => localStorage.setItem('marpay.user', JSON.stringify(updated_user))
         )
    );
  }

}
