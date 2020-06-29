import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './auth.service';


export class Medsession {
  constructor(
    public id?: string,
    public created?: string,
    public updated?: string,
    public status?: string,
    public session_customer?: any,
    public session_telehealthworker?: any,
    public session_physician?: any
  ) {}

  static create(data: any): Medsession {
    return new Medsession(
      data.id,
      data.created,
      data.updated,
      data.status,
      User.create(data.session_customer),
      data.session_telehealthworker ? User.create(data.session_telehealthworker) : null
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class MedsessionService {
  constructor(
    private http: HttpClient
  ) {}

  getMedsessions(): Observable<Medsession[]> {
    return this.http.get<Medsession[]>('/api/medsession/').pipe(
      map(medsessions => medsessions.map(medsession => Medsession.create(medsession)))
    );
  }
}