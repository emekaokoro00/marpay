import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private router: Router) {}
  
  getUser(): User {
    return User.getUser();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.getUser()) {
      return true;
    } 
    else {
      this.router.navigate(['/log-in'], {
        queryParams: {
          return: state.url
        }
       });
      return false;
    }
  }
}