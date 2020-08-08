import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DialogaConfirmComponent } from '../dialogas/dialoga-confirm/dialoga-confirm.component';
import { Medsession, MedsessionService } from '../../services/medsession.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  medsession: Medsession;

  constructor(
    private route: ActivatedRoute,
    public matdialog: MatDialog,
    private medsessionService: MedsessionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: {medsession: Medsession}) => this.medsession = data.medsession
    );
  }

  cancelMedsessionStatus(status: string): void { 
    this.medsession.status = status;
    this.medsessionService.cancelMedsession(this.medsession);
  }

  openConfirmCancelDialog(): void {
    const dialogRef = this.matdialog.open(DialogaConfirmComponent, {
      width: '300px',
      height: '200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Ok') {
         this.cancelMedsessionStatus('CANCELLED');
	};
    });
  }


}
