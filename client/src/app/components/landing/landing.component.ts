import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

import { GoogleMapsService } from '../../services/google-maps.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';

import { DialogaAddressConfirmComponent } from '../dialogas/dialoga-address-confirm/dialoga-address-confirm.component';

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
export class LandingComponent implements OnInit, OnDestroy {

  current_user: User = new User();
  medsession: Medsession = new Medsession();
  address: string;

  geocoder: any;
  lat = 0;
  lng = 0;
  zoom = 13;
  markers: Marker[];

  messages: Subscription;
  medsessions: Medsession[];

  constructor(
    private authService: AuthService,
    private googleMapsService: GoogleMapsService,
    private router: Router,
    public matdialog: MatDialog,
    private medsessionService: MedsessionService,

    private route: ActivatedRoute,
    private toastr: ToastrManager
  ) {}

  getUser(): User {
    return User.getUser();
  }
  isCustomer(): boolean {
    return User.isCustomer();
  }
  isTelehealthworker(): boolean {
    return User.isTelehealthworker();
  }
  logOut(): void {
    this.authService.logOut().subscribe(() => {}, (error) => {
      console.error(error);
    });
  }

  ngOnInit(): void {
    this.current_user = User.getUser();
    if (!this.current_user) { return; }

    if (this.current_user.current_group === 'customer'){
       // get position marker to show
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
    else if (this.current_user.current_group === 'telehealthworker'){
/*    //<thw_medesession_in_landing>
      this.route.data.subscribe((data: {medsessions: Medsession[]}) => this.medsessions = data.medsessions);

      // connect to service
      this.medsessionService.connect();
      this.messages = this.medsessionService.messages.subscribe((message: any) => {
        const medsession: Medsession = Medsession.create(message.data);
        this.updateMedsessions(medsession);
        this.updateToast(medsession);
      });*/
    }

  }

  ngOnDestroy(): void {
   if (!this.current_user) { return; }
   if (this.current_user.current_group === 'telehealthworker') {
     // this.messages.unsubscribe(); //<thw_medesession_in_landing>
   }
  }

// customer_section///////////////////////////////////////////////////////////

  openDialog(): void {
    const dialogRef = this.matdialog.open(DialogaAddressConfirmComponent, {
      width: '300px',
      height: '250px',
      // data: { address: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) } }
      data: { address: this.address, lat: this.lat, lng: this.lng } // reverse-geocode in dialog ngOnInit
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


// telehealthworker_section///////////////////////////////////////////////////////////

  get requestedMedsessions(): Medsession[] {
    return this.medsessions.filter(medsession => {
      return medsession.status === 'REQUESTED';
    });
  }

  updateMedsessions(medsession: Medsession): void {
    this.medsessions = this.medsessions.filter(thisMedsession => thisMedsession.id !== medsession.id);
    this.medsessions.push(medsession);
  }

  updateToast(medsession: Medsession): void {
    if (medsession.session_telehealthworker === null && medsession.status !== 'CANCELLED') {
      this.toastr.successToastr(`Customer ${medsession.session_customer.username} has requested a medsession.`);
    }
    else if (medsession.status === 'CANCELLED') {
      this.toastr.errorToastr(`Customer ${medsession.session_customer.username} has requested a medsession.`);
    }
  }

}

