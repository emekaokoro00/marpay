import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../services/auth.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  calleeUser: User;
}

@Component({
  selector: 'app-dialoga-call-confirm',
  templateUrl: './dialoga-call-confirm.component.html',
  styleUrls: ['./dialoga-call-confirm.component.css']
})
export class DialogaCallConfirmComponent implements OnInit {

    // constructor() {}

  constructor(
    public dialogRef: MatDialogRef<DialogaCallConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
  
  //ngOnInit() {
  //}
  
	ngOnInit() {
	   this.loadScript("src/assets/js/home_functions.js");
	    this.loadScript("src/assets/js/twilio-video.min.js");
	    this.loadScript("src/assets/js/require.js");
	}

	public loadScript(url) {
	    let node = document.createElement('script');
	    node.src = url;
	    node.type = 'text/javascript';
    	    node.async = true;
    	    node.charset = "utf-8";
	    document.getElementsByTagName('head')[0].appendChild(node);
	}
  
}