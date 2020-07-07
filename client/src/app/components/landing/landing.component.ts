import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../../services/google-maps.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogaAddressConfirmComponent } from '../dialoga-address-confirm/dialoga-address-confirm.component';

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
  address: string;

  geocoder: any;
  lat = 0;
  lng = 0;
  zoom = 13;
  markers: Marker[];

  constructor(
    private authService: AuthService,
    private googleMapsService: GoogleMapsService,
    private router: Router,
    public matdialog: MatDialog,
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

    // get address here

  }


   geocodeLatLng(geocoder, map, infowindow): string {
     // var input = document.getElementById('latlng').value;
     // var latlngStr = input.split(',', 2);
     var geocoder = new google.maps.Geocoder;
     var latlng = {lat: parseFloat(this.markers[0]), lng: parseFloat(this.markers[1])};
     geocoder.geocode({'location': latlng}, function(results, status) {
       if (status === 'OK') {
         if (results[0]) {
           map.setZoom(11);
           var marker = new google.maps.Marker({
             position: latlng,
             map: map
           });
           infowindow.setContent(results[0].formatted_address);
           infowindow.open(map, marker);
         } else {
           window.alert('No results found');
         }
       } else {
         window.alert('Geocoder failed due to: ' + status);
       }
     });
   }








  openDialog(): void {

    // or get address here

    const dialogRef = this.matdialog.open(DialogaAddressConfirmComponent, {
      width: '300px',
      height: '250px',
      // data: { address: this.address }
      data: { address: '100 Independence Avenue, Quincy MA 02169' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
      if (result) {
         // result = 'empty';
         this.onSubmit(result);
      }
    });
  }

  onSubmit(dialog_address): void {
    this.medsession.session_customer = this.current_user;
    // use [current position] or [saved user position] as session_address
    this.medsession.session_address = dialog_address
    this.medsessionService.createMedsession(this.medsession);
    this.router.navigateByUrl('/customer');
  }

}
