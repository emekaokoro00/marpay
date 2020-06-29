import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Medsession } from '../../services/medsession.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  medsession: Medsession;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: {medsession: Medsession}) => this.medsession = data.medsession
    );
  }
}
