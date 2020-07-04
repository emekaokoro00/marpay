import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

import { Subscription } from 'rxjs';

import { Medsession, MedsessionService } from '../../services/medsession.service';

@Component({
  selector: 'app-telehealthworker-dashboard',
  templateUrl: './telehealthworker-dashboard.component.html',
  styleUrls: ['./telehealthworker-dashboard.component.css']
})
export class TelehealthworkerDashboardComponent implements OnInit, OnDestroy {
  messages: Subscription;
  medsessions: Medsession[];

  constructor(
    private route: ActivatedRoute,
    private medsessionService: MedsessionService,
    private toastr: ToastrManager
	) {}

  get currentMedsessions(): Medsession[] {
    return this.medsessions.filter(medsession => {
      return medsession.session_telehealthworker !== null && medsession.status !== 'COMPLETED';
    });
  }

  get requestedMedsessions(): Medsession[] {
    return this.medsessions.filter(medsession => {
      return medsession.status === 'REQUESTED';
    });
  }

  get completedMedsessions(): Medsession[] {
    return this.medsessions.filter(medsession => {
      return medsession.status === 'COMPLETED';
    });
  }
  
  // this is where we connect to the medsesson service created
  ngOnInit(): void {
      this.route.data.subscribe((data: {medsessions: Medsession[]}) => this.medsessions = data.medsessions);
      this.medsessionService.connect();
      this.messages = this.medsessionService.messages.subscribe((message: any) => {
      const medsession: Medsession = Medsession.create(message.data);
      this.updateMedsessions(medsession);
      this.updateToast(medsession);
    });
  }

  updateMedsessions(medsession: Medsession): void {
    this.medsessions = this.medsessions.filter(thisMedsession => thisMedsession.id !== medsession.id);
    this.medsessions.push(medsession);
  }

  updateToast(medsession: Medsession): void {
    if (medsession.session_telehealthworker === null) {
      this.toastr.infoToastr(`Customer ${medsession.session_customer.username} has requested a medsession.`);
    }
  }

  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }

}