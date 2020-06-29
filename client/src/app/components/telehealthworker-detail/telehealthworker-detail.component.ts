import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../services/auth.service';
import { Medsession, MedsessionService } from '../../services/medsession.service';

@Component({
  selector: 'app-telehealthworker-detail',
  templateUrl: './telehealthworker-detail.component.html',
  styleUrls: ['./telehealthworker-detail.component.css']
})
export class TelehealthworkerDetailComponent implements OnInit {
  medsession: Medsession;

  constructor(
    private route: ActivatedRoute,
    private medsessionService: MedsessionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: {medsession: Medsession}) => this.medsession = data.medsession);
  }

  updateMedsessionStatus(status: string): void {
    this.medsession.session_telehealthworker = User.getUser();
    this.medsession.status = status;
    this.medsessionService.updateMedsession(this.medsession);
  }
}
