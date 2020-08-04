import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { DialogaSessionDetailsComponent } from '../dialogas/dialoga-session-details/dialoga-session-details.component';
import { DialogaCallConfirmComponent } from '../dialogas/dialoga-call-confirm/dialoga-call-confirm.component';

import { User } from '../../services/auth.service';
import { Medsession, MedsessionService } from '../../services/medsession.service';

@Component({
  selector: 'app-telehealthworker-detail',
  templateUrl: './telehealthworker-detail.component.html',
  styleUrls: ['./telehealthworker-detail.component.css']
})
export class TelehealthworkerDetailComponent implements OnInit {
  medsession: Medsession;
  session_random_details: string;

  constructor(
    private route: ActivatedRoute,
    public matdialog: MatDialog,
    private medsessionService: MedsessionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: {medsession: Medsession}) => this.medsession = data.medsession);
    // UPDATE TOAST-LIKE EVENT TO MAKE BUTTON TO CONNECT SHOW... like in customer-dashboard.component.ts
  }

  updateMedsessionStatus(status: string, ...extraData: string[]): void { 
    // extraData is session_random_details: preferredPlatform + sessionReason,...

    this.medsession.session_telehealthworker = User.getUser();
    this.medsession.status = status;

    // for passing extra session data
    if (extraData) {
	if (extraData.length > 0) { this.medsession.session_reason = extraData[0]; }
       	// if (extraData.length > 1) { this.medsession.new_field = session_reason; }
    }
    this.medsessionService.updateMedsession(this.medsession);

    // update if physician exists
    if (this.medsession.session_physician) { 
	this.medsessionService.updateMedsessionForPhysician(this.medsession); // change to avoid updating medsession twice
    }
  }


  openSessionDetailDialog(): void {
    const dialogRef = this.matdialog.open(DialogaSessionDetailsComponent, {
      // width: '300px',
      // height: '250px',
      data: { sessionCustomer: this.medsession.session_customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.session_random_details = result.preferredPlatform + ' | ' + result.sessionReason;
      if (result) {
         // result = 'empty'; // result is currently a data object with session_customer, and physician-relevant details
         this.updateMedsessionStatus('IN_PROGRESS', this.session_random_details);
      }
    });
  }

  openCallDialog(): void {
    const dialogRef = this.matdialog.open(DialogaCallConfirmComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: { user_host: this.medsession.session_telehealthworker, user_callee: this.medsession.session_telehealthworker ? this.medsession.session_telehealthworker : this.medsession.session_customer, user_caller: this.medsession.session_physician }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      if (result) {
         this.updateMedsessionStatus('IN_PROGRESS');
	 // this.router.navigate(['/call']);
      }
    });
  }

}
