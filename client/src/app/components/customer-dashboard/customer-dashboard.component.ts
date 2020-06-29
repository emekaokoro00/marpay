import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Medsession, MedsessionService } from '../../services/medsession.service';


@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  messages: Subscription;
  medsessions: Medsession[];

  constructor(
    private route: ActivatedRoute,
    private medsessionService: MedsessionService
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
    });
  }

  updateMedsessions(medsession: Medsession): void {
    this.medsessions = this.medsessions.filter(thisMedsession => thisMedsession.id !== medsession.id);
    this.medsessions.push(medsession);
  }

  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}