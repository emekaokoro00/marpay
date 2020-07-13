import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';

import { User } from '../../../services/auth.service';
import { Medsession, MedsessionService } from '../../../services/medsession.service';

export interface DialogData {
  sessionCustomer: User;
  sessionReason: string;
  preferredPlatform: string;
}

@Component({
  selector: 'app-dialoga-session-details',
  templateUrl: './dialoga-session-details.component.html',
  styleUrls: ['./dialoga-session-details.component.css']
})
export class DialogaSessionDetailsComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;  
  platforms: string[] = ['Video Call', 'Phone Call'];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogaSessionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
      firstCtrlFormat: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  getErrorList(errorObject) {
    if (errorObject) {
      return Object.keys(errorObject);
    }
  }
  
}