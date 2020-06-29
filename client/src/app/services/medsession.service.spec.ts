import {
  HttpClientTestingModule, HttpTestingController, TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MedsessionService } from './medsession.service';
import { MedsessionFactory } from '../testing/factories';



describe('MedsessionService', () => {
  let medsessionService: MedsessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    medsessionService = TestBed.get(MedsessionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should allow a user to get a list of medsessions', () => {
    const medsession1 = MedsessionFactory.create();
    const medsession2 = MedsessionFactory.create();
    medsessionService.getMedsessions().subscribe(medsessions => {
      expect(medsessions).toEqual([medsession1, medsession2]);
    });
    const request: TestRequest = httpMock.expectOne('/api/medsession/');
    request.flush([
      medsession1,
      medsession2
    ]);
  });

  afterEach(() => {
    httpMock.verify();
  });
});