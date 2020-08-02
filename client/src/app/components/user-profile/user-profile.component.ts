import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

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
