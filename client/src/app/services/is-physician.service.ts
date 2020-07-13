import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { User } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class IsPhysician implements CanActivate {
  canActivate(): boolean {
    return User.isPhysician();
  }
}
