import { Observable, of } from 'rxjs';
import { Medsession } from '../services/medsession.service';
import { MedsessionListResolver } from './medsession-list.resolver';
import { MedsessionFactory } from '../testing/factories';

describe('MedsessionListResolver', () => {
  it('should resolve a list of medsessions', () => {
    const medsessionsMock: Medsession[] = [
      MedsessionFactory.create(),
      MedsessionFactory.create()
    ];
    const medsessionServiceMock: any = {
      getMedsessions: (): Observable<Medsession[]> => {
        return of(medsessionsMock);
      }
    };
    const medsessionListResolver: MedsessionListResolver = new MedsessionListResolver(medsessionServiceMock);
    medsessionListResolver.resolve(null, null).subscribe(medsessions => {
      expect(medsessions).toBe(medsessionsMock);
    });
  });
});
