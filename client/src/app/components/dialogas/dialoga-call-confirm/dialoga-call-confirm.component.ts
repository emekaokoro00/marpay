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
    //this.unloadScript("assets/js/jquery-3.5.1.min.js", "js");
    //this.unloadScript("assets/js/twilio-video.min.js", "js");
    //this.unloadScript("assets/js/home_functions.js", "js") //remove all occurences "home_functions.js" on page

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

	public unloadScript2(src) {
		$('script[src="' + src + '"]').remove();
	}

	public unloadScript(filename, filetype){
	 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
	 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
	 var allsuspects=document.getElementsByTagName(targetelement)
	 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
	  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
	   allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
	 }
	}    

}