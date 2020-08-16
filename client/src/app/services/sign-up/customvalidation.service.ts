import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { UserProfileService, UserSearchResponse } from '../user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor(
     private userProfileService: UserProfileService
  ) { }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      // const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'); // min 8char, at least 1upper, 1lower and 1num.
      const regex = new RegExp('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$'); // min 8char, at least 1letter and 1num.
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  userNameValidator(userControl: AbstractControl) {
    return new Promise(resolve => {
      setTimeout(() => {
	//check if email constraints are satisfied
        if (this.isEmailNotInServerFormat(userControl.value)) {
          resolve({ userNameNotAcceptedEmail: true });
        }
	else {
	//check if username already exists
	this.doesUserNameAlreadyExist(userControl.value)
	  .subscribe(res => {
             if (res && res.exists) {
	       console.log(res.exists);
               resolve({ userNameNotAvailable: true });
             } 
             else {
               resolve(null);
             }
	   });
	}

      }, 1500);

    });
  }

  isEmailNotInServerFormat(email: string) {
    const regex = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$'); // make sure to copy server Regex Format
    const valid = regex.test(email);
    // console.log(valid);
    return valid ? false : true;
  }

  doesUserNameAlreadyExist(userName: string) {    
    return this.userProfileService.get_by_username(userName)
       .pipe(
          map(value => { return value;})
       );
  }

}
