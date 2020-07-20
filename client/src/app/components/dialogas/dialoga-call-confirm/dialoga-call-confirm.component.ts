import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../services/auth.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  user_host: User;
  user_caller: User;
  user_callee: User;
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
  
  // ngOnInit() {
  // }
  // "src/home_functions.js",
  // "src/assets/js/twilio-video.min.js",
  // "src/assets/js/require.js",
  
  ngOnInit() {
    this.loadScript("assets/js/jquery-3.5.1.min.js");
    this.loadScript("assets/js/twilio-video.min.js");
    // this.loadScript("assets/js/require.js");
    this.loadScript("assets/js/home_functions.js");
    // console.log('init runs');
  }

	public loadScript(url) {   
	    // to check if the url has already been added previously   
	    var isFound = false;
	    var scripts = document.getElementsByTagName("script")
	    for (var i = 0; i < scripts.length; ++i) {
		if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes(url)) {
		    isFound = true;
		}
	    }

	    // if not found, add resource
	    if (!isFound) {
		    let node = document.createElement('script');
		    node.src = url;
		    node.type = 'text/javascript';
	    	    node.async = true;
	    	    node.charset = "utf-8";
		    document.getElementsByTagName('head')[0].appendChild(node);
	    }
	}    

}