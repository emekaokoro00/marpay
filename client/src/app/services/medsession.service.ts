import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { map, share } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from './auth.service';


export class Medsession { 
  public otherUser: User;
  constructor(
    public id?: string,
    public created?: string,
    public updated?: string,
    public session_address?: string,
    public session_address_for_telehealthworker?: string,
    public status?: string,
    public status_to_physician?: string,
    public session_reason?: string,
    public session_customer?: any,
    public session_telehealthworker?: any,
    public session_physician?: any
    ) {
        this.otherUser = User.isCustomer() ? this.session_telehealthworker : this.session_customer;
      }

  static create(data: any): Medsession {
    return new Medsession(
      data.id,
      data.created,
      data.updated,
      data.session_address,
      data.session_address_for_telehealthworker,
      data.status,
      data.status_to_physician,
      data.session_reason,
      User.create(data.session_customer),
      data.session_telehealthworker ? User.create(data.session_telehealthworker) : null,
      data.session_physician ? User.create(data.session_physician) : null
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class MedsessionService {

  webSocket: WebSocketSubject<any>;
  messages: Observable<any>;

  constructor(
    private http: HttpClient
  ) {}

  // calling connect initializes the websocket
  connect(): void {
    if (!this.webSocket || this.webSocket.closed) {
      // this.webSocket = webSocket('ws://localhost:8080/marpay/');
      // this.webSocket = webSocket('ws://marpay.herokuapp.com/marpay/');
      
      this.webSocket = webSocket(environment.WEBSOCKET_ADDRESS); //from environment config file

      this.messages = this.webSocket.pipe(share());
      this.messages.subscribe(message => console.log(message));
    }
  }

  getMedsessions(): Observable<Medsession[]> {
    return this.http.get<Medsession[]>('/api/medsession/').pipe(
      map(medsessions => medsessions.map(medsession => Medsession.create(medsession)))
    );
  }

  createMedsession(medsession: Medsession): void {
    this.connect();
    const message: any = {
      type: 'create.medsession',
      data: {
        ...medsession, session_customer: medsession.session_customer.id
      }
    };
    this.webSocket.next(message);
  }

  getMedsession(id: string): Observable<Medsession> {
    return this.http.get<Medsession>(`/api/medsession/${id}/`).pipe(
      map(medsession => Medsession.create(medsession))
    );
  }

  updateMedsession(medsession: Medsession): void {
    this.connect();
    const message: any = {
      type: 'update.medsession',
      data: {
        ...medsession, session_telehealthworker: medsession.session_telehealthworker.id, session_customer: medsession.session_customer.id
      }
    };
    this.webSocket.next(message);
  }

  updateMedsessionForPhysician(medsession: Medsession): void {
    this.connect();
    const message: any = {
      type: 'update.medsessionforphysician',
      data: {
        ...medsession, session_physician: medsession.session_physician.id, session_telehealthworker: medsession.session_telehealthworker.id, session_customer: medsession.session_customer.id
      }
    };
    this.webSocket.next(message);
  }

}