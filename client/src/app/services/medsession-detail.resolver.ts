import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Medsession, MedsessionService } from '../services/medsession.service';

// import { AuthService, User } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedsessionDetailResolver implements Resolve<Medsession> {
  constructor(private medsessionService: MedsessionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Medsession> {
    return this.medsessionService.getMedsession(route.params.id);
    // if (User.isAnyUser()) { return this.medsessionService.getMedsession(route.params.id); }
  }
}