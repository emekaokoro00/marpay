import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.css']
})
export class UserProfileDetailComponent implements OnInit {

  user: User = new User();
  cannotBeTHW: boolean = true;

  constructor() { }

  isTelehealthworker(): boolean {
    return User.isTelehealthworker();
  }
  canBeTelehealthworker(): boolean {
    return User.canBeTelehealthworker();
  }

  ngOnInit(): void {
    this.user = User.getUser();
    console.log(JSON.stringify(this.user));
  }
  
  isDivHidden= true;   
  toggleDisplayDiv() {
    this.isDivHidden = !this.isDivHidden;
  }

}