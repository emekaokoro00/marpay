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

  current_user: User;
  userData: UserData = new UserData();
  updateForm: FormGroup;
  constructor(
     private formBuilder: FormBuilder, 
     private router: Router,
     private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.current_user = User.getUser();
    localStorage.setItem('marpay.user', JSON.stringify(this.current_user))
    console.log(JSON.stringify(this.current_user))

    // this.userData.id = this.current_user.id;
    this.userData.firstName = this.current_user.first_name;
    this.userData.lastName = this.current_user.last_name;

    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.updateForm.setValue(this.userData);
    //this.userProfileService.getUser(this.current_user.id).subscribe( data => {
    //    this.updateForm.setValue(data);
    //  });
  }

  
  onSubmit(){
    this.current_user.first_name = this.userData.firstName;
    this.current_user.last_name = this.userData.lastName;
    this.userProfileService.updateUser(this.current_user.id, this.userData.firstName, this.userData.lastName)
     //.pipe(first())
     .subscribe(() => {
       this.current_user = User.getUser();
       this.router.navigate(['/user-profile']);
     }, error => {
       console.error(error);
    });
  }

}
