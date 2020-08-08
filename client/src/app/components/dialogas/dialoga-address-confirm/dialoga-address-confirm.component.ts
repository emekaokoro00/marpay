import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GoogleMapsService } from '../../../services/google-maps.service';

export interface DialogData {
  address: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-dialoga-address-confirm', // had to slightly change name to 'dialoga' make it work
  templateUrl: './dialoga-address-confirm.component.html',
  styleUrls: ['./dialoga-address-confirm.component.css']
})
export class DialogaAddressConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogaAddressConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,    
    private googleMapsService: GoogleMapsService
    ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit() {
    // reverse geocode address
    this.googleMapsService.reverseGeocode(this.data.lat, this.data.lng).subscribe((results: any) => {
       this.data.address = results[0].formatted_address;
    });

  }
  
}