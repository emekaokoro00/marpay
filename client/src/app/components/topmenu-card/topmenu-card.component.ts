import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
// import {Router} from '@angular/router';

@Component({
  selector: 'app-topmenu-card',
  templateUrl: './topmenu-card.component.html',
  styleUrls: ['./topmenu-card.component.css']
})
export class TopmenuCardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  getUser(): User {
    return User.getUser();
  }
  isCustomer(): boolean {
    return User.isCustomer();
  }
  isTelehealthworker(): boolean {
    return User.isTelehealthworker();
  }
  isPhysician(): boolean {
    return User.isPhysician();
  }
  logOut(): void {
    // this.router.navigate(['/']);
    this.authService.logOut().subscribe(() => {}, (error) => {
      console.error(error);
    });
  }

  ngOnInit() {
  }

}
