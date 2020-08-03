import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.css']
})
export class UserProfileDetailComponent implements OnInit {

  current_user: User = new User();

  constructor() { }

  ngOnInit(): void {
    this.current_user = User.getUser();
  }
  
  isDivHidden= true;   
  toggleDisplayDiv() {
    this.isDivHidden = !this.isDivHidden;
  }

}