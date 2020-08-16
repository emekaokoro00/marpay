import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

class UserData {
  constructor(
    public username?: string,
    public firstName?: string,
    public lastName?: string,
    public password1?: string,
    public password2?: string,
    public currentGroup?: string,
    public currentRole?: string
  ) {}
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  user: UserData = new UserData();
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  onChange(event): void {
    if (event.target.files && event.target.files.length > 0) {
      // this.user.photo = event.target.files[0];
    }
  }
  onSubmit(): void {
    this.authService.signUp(
      this.user.username,
      this.user.firstName,
      this.user.lastName,
      this.user.password1,
      this.user.password2,
      'customer', //this.user.currentGroup
      this.user.currentRole
    ).subscribe(() => {
      this.router.navigateByUrl('/log-in'); // consider a success page
    }, (error) => {
      console.error(error);
    });
  }
}
