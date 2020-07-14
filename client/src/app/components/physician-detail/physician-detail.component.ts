import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { DialogaCallConfirmComponent } from '../dialogas/dialoga-call-confirm/dialoga-call-confirm.component';

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
    private router: Router,
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
    const dialogRef = this.matdialog.open(DialogaCallConfirmComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: { calleeUser: this.medsession.session_telehealthworker ? this.medsession.session_telehealthworker : this.medsession.session_customer }
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
