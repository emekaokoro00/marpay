import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../../services/google-maps.service';

// import {MdDialog} from '@angular/material';

import { Medsession, MedsessionService } from '../../services/medsession.service';

class Marker {
  constructor(
    public lat: number,
    public lng: number,
    public label?: string
  ) {}
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  current_user: User = new User();
  medsession: Medsession = new Medsession();
  lat = 0;
  lng = 0;
  zoom = 13;
  markers: Marker[];

  constructor(
    private authService: AuthService,
    private googleMapsService: GoogleMapsService,
    private router: Router,
    // public dialog: MdDialog,
    private medsessionService: MedsessionService
  ) {}


  getUser(): User {
    return User.getUser();
  }
  isCustomer(): boolean {
    return User.isCustomer();
  }
  logOut(): void {
    this.authService.logOut().subscribe(() => {}, (error) => {
      console.error(error);
    });
  }

  ngOnInit(): void {
    this.current_user = this.getUser();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.markers = [
          new Marker(this.lat, this.lng)
        ];
      });
    }
  }

  onSubmit(): void {
    this.medsession.session_customer = this.current_user;
    // use [current position] or [saved user position] as session_address
    // this.medsession.session_address = dialog_address
    this.medsessionService.createMedsession(this.medsession);
    this.router.navigateByUrl('/customer');
  }




}
