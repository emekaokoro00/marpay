import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Medsession, MedsessionService } from '../services/medsession.service';

// import { AuthService, User } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class MedsessionListResolver implements Resolve<Medsession[]> {
  constructor(private medsessionService: MedsessionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Medsession[]> {
    // use this to get the set of medsessions the thw should see (as opposed to all medsessions)
    return this.medsessionService.getMedsessions();
    // if (User.isAnyUser()) { return this.medsessionService.getMedsessions(); }
  }
}