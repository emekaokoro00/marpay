import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  address: string;
}

@Component({
  selector: 'app-dialoga-address-confirm', // had to slightly change name to 'dialoga' make it work
  templateUrl: './dialoga-address-confirm.component.html',
  styleUrls: ['./dialoga-address-confirm.component.css']
})
export class DialogaAddressConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogaAddressConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit() {
  }
  
}