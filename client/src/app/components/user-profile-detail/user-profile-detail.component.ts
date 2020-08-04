import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, User } from '../../services/auth.service';
import {UserProfileService} from "../../services/user-profile.service";

import { DialogaConfirmComponent } from '../dialogas/dialoga-confirm/dialoga-confirm.component';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.css']
})
export class UserProfileDetailComponent implements OnInit {

  user: User = new User();
  otherGroup: string = 'Customer';

  constructor(
    public matdialog: MatDialog,
    private userProfileService: UserProfileService
  ) { }

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

  toggleTHW() {
    this.user.current_group !== 'telehealthworker' ? this.user.current_group = 'telehealthworker' : this.user.current_group = 'customer';
    this.userProfileService.updateUser(this.user)
     .subscribe(() => {
       // alert('successful');
     }, error => {
       console.error(error);
    });
  }    

  toggleTHWDialog(): void {
    const dialogRef = this.matdialog.open(DialogaConfirmComponent, {
      width: '300px',
      height: '200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Ok') {
         this.toggleTHW();
	};
    });
  }

}