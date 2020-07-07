import { Component, OnInit, Inject } from '@angular/core';

// import {MdDialog} from '@angular/material';
// import {MD_DIALOG_DATA} from '@angular/material';
// import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-address-confirm',
  templateUrl: './dialog-address-confirm.component.html',
  styleUrls: ['./dialog-address-confirm.component.css']
})
export class DialogAddressConfirmComponent implements OnInit {

constructor() { }

  // constructor(public thisDialogRef: 
// 	MdDialogRef<DialogAddressConfirmComponent>, @Inject(MD_DIALOG_DATA) public data: string) { }
  
  ngOnInit() {
  }
  
  onCloseConfirm() {
    // this.thisDialogRef.close('ok');
  }
  onCloseCancel() {
    // this.thisDialogRef.close('cancel');
  }

}
