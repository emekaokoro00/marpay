import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { DialogaSessionDetailsComponent } from '../dialogas/dialoga-session-details/dialoga-session-details.component';

import { User } from '../../services/auth.service';
import { Medsession, MedsessionService } from '../../services/medsession.service';

@Component({
  selector: 'app-physician-detail',
  templateUrl: './physician-detail.component.html',
  styleUrls: ['./physician-detail.component.css']
})
export class PhysicianDetailComponent implements OnInit {
  medsession: Medsession;

  constructor(
    private route: ActivatedRoute,
    public matdialog: MatDialog,
    private medsessionService: MedsessionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: {medsession: Medsession}) => this.medsession = data.medsession);
  }

  updateMedsessionStatus(status_to_physician: string): void {
    this.medsession.session_physician = User.getUser();
    this.medsession.status_to_physician = status_to_physician;
    this.medsessionService.updateMedsessionForPhysician(this.medsession); // see if you can integrate into updateMedsession later
  }

  
  // disable 'Call' button; after call end, enable 'End Session';
  openCallDialog(): void {
    const dialogRef = this.matdialog.open(DialogaSessionDetailsComponent, {
      // width: '300px',
      // height: '250px',
      data: { sessionCustomer: this.medsession.session_customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      if (result) {
         // result = 'empty'; // result is currently a data object with session_customer, and physician-relevant details
         this.updateMedsessionStatus('IN_PROGRESS');
      }
    });
  }

}
