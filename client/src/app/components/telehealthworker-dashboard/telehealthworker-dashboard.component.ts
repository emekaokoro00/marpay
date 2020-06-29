import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Medsession } from '../../services/medsession.service';

@Component({
  selector: 'app-telehealthworker-dashboard',
  templateUrl: './telehealthworker-dashboard.component.html',
  styleUrls: ['./telehealthworker-dashboard.component.css']
})
export class TelehealthworkerDashboardComponent implements OnInit {
  medsessions: Medsession[];

  constructor(private route: ActivatedRoute) {}

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

  ngOnInit(): void {
    this.route.data
      .subscribe((data: {medsessions: Medsession[]}) => this.medsessions = data.medsessions);
  }
}