import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Medsession } from '../services/medsession.service';
import { MedsessionDetailResolver } from './medsession-detail.resolver';
import { MedsessionFactory } from '../testing/factories';

describe('MedsessionDetailResolver', () => {
  it('should resolve a medsession', () => {
    const medsessionMock: Medsession = MedsessionFactory.create();
    const medsessionServiceMock: any = {
      getMedsession: (id: string): Observable<Medsession> => {
        return new Observable<Medsession>(observer => {
          observer.next(medsessionMock);
          observer.complete();
        });
      }
    };
    const medsessionDetailResolver: MedsessionDetailResolver = new MedsessionDetailResolver(medsessionServiceMock);
    const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    route.params = {id: medsessionMock.id};
    medsessionDetailResolver.resolve(route, null).subscribe(medsession => {
      expect(medsession).toBe(medsessionMock);
    });
  });
});