import { Component, Input } from '@angular/core';
import { Medsession } from '../../services/medsession.service';

@Component({
  selector: 'app-medsession-card',
  templateUrl: './medsession-card.component.html',
  styleUrls: ['./medsession-card.component.css']
})
export class MedsessionCardComponent {
  @Input() title: string;
  @Input() medsessions: Medsession[];
  constructor() {  }
}