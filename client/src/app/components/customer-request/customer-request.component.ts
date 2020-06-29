import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../../services/google-maps.service';

import { User } from '../../services/auth.service';
import { Medsession, MedsessionService } from '../../services/medsession.service';

class Marker {
  constructor(
    public lat: number,
    public lng: number,
    public label?: string
  ) {}
}

@Component({
  selector: 'app-customer-request',
  templateUrl: './customer-request.component.html',
  styleUrls: ['./customer-request.component.css']
})
export class CustomerRequestComponent {
  medsession: Medsession = new Medsession();
  lat = 0;
  lng = 0;
  zoom = 13;
  markers: Marker[];

  constructor(
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private medsessionService: MedsessionService
  ) {}

  ngOnInit(): void {
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

  onUpdate(): void {
    if (
      !!this.medsession.session_address_for_telehealthworker &&
      !!this.medsession.session_address
    ) {
      this.googleMapsService.directions(
        this.medsession.session_address_for_telehealthworker,
        this.medsession.session_address
      ).subscribe((data: any) => {
        const route: any = data.routes[0];
        const leg: any = route.legs[0];
        this.lat = leg.start_location.lat();
        this.lng = leg.start_location.lng();
        this.markers = [
          {
            lat: leg.start_location.lat(),
            lng: leg.start_location.lng(),
            label: 'A'
          },
          {
            lat: leg.end_location.lat(),
            lng: leg.end_location.lng(),
            label: 'B'
          }
        ];
      });
    }
  }

  onSubmit(): void {
    this.medsession.session_customer = User.getUser();
    this.medsessionService.createMedsession(this.medsession);
    this.router.navigateByUrl('/customer');
  }
}
