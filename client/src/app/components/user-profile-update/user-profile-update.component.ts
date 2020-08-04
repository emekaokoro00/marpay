import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {User} from "../../services/auth.service";
import {UserProfileService} from "../../services/user-profile.service";

class UserData {
  constructor(
    // public id?: number,
    // public username?: string,
    public firstName?: string,
    public lastName?: string,
    // public currentGroup?: string
  ) {}
}

@Component({
  selector: 'app-user-profile-update',
  templateUrl: './user-profile-update.component.html',
  styleUrls: ['./user-profile-update.component.css']
})
export class UserProfileUpdateComponent implements OnInit {

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

    // initial value of userData
    this.userData.firstName = this.user.first_name;
    this.userData.lastName = this.user.last_name;

    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.updateForm.setValue(this.userData);
  }

  
  onSubmit(){
    // final value of userData
    this.user.first_name = this.userData.firstName;
    this.user.last_name = this.userData.lastName;

    this.userProfileService.updateUser(this.user)
     //.pipe(first())
     .subscribe(() => {
       this.router.navigate(['/user-profile']);
     }, error => {
       console.error(error);
    });
  }

}
