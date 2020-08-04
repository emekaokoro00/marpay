import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  answer: string;
}

@Component({
  selector: 'app-dialoga-confirm',
  templateUrl: './dialoga-confirm.component.html',
  styleUrls: ['./dialoga-confirm.component.css']
})
export class DialogaConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogaConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close('Ok');
  }

  ngOnInit(): void {
  }

}
