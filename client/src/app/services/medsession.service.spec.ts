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

  it('should allow a user to create a medsession', () => {
    medsessionService.webSocket = jasmine.createSpyObj('webSocket', ['next']);
    const medsession = MedsessionFactory.create();
    medsessionService.createMedsession(medsession);
    expect(medsessionService.webSocket.next).toHaveBeenCalledWith({
      type: 'create.medsession',
      data: {
        ...medsession, session_customer: medsession.session_customer.id
      }
    });
  });

  it('should allow a user to get a medsession by ID', () => {
    const medsessionData = MedsessionFactory.create();
    medsessionService.getMedsession(medsessionData.id).subscribe(medsession => {
      expect(medsession).toEqual(medsessionData);
    });
    const request: TestRequest = httpMock.expectOne(`/api/medsession/${medsessionData.id}/`);
    request.flush(medsessionData);
  });

  it('should allow a user to update a medsession', () => {
    medsessionService.webSocket = jasmine.createSpyObj('webSocket', ['next']);
    const medsession = MedsessionFactory.create({status: 'IN_PROGRESS'});
    medsessionService.updateMedsession(medsession);
    expect(medsessionService.webSocket.next).toHaveBeenCalledWith({
      type: 'update.medsession',
      data: {
        ...medsession, session_telehealthworker: medsession.session_telehealthworker.id, session_customer: medsession.session_customer.id
      }
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});