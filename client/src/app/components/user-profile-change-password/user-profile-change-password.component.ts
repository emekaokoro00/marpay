import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {User} from "../../services/auth.service";
import {UserProfileService} from "../../services/user-profile.service";


class UserData {
  constructor(
    public oldPassword?: string,
    public newPassword1?: string,
    public newPassword2?: string,
  ) {}
}

@Component({
  selector: 'app-user-profile-change-password',
  templateUrl: './user-profile-change-password.component.html',
  styleUrls: ['./user-profile-change-password.component.css']
})
export class UserProfileChangePasswordComponent implements OnInit {

  user: User;
  userData: UserData = new UserData();
  updateForm: FormGroup;
  constructor(
     private formBuilder: FormBuilder, 
     private router: Router,
     private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.user = User.getUser();

    this.userData.oldPassword = '';
    this.userData.newPassword1 = '';
    this.userData.newPassword2 = '';

    this.updateForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword1: ['', Validators.required],
      newPassword2: ['', Validators.required]
    });

    this.updateForm.setValue(this.userData);
  }

  
  onSubmit(){
    this.userProfileService.change_password(this.user, this.userData.oldPassword, this.userData.newPassword1, this.userData.newPassword2)
     //.pipe(first())
     .subscribe(() => {
       this.router.navigateByUrl('/user-profile');
     }, error => {
       console.error(error);
    });
  }

}
