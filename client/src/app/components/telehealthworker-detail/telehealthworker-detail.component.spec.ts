import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { MedsessionService } from '../../services/medsession.service';
import { MedsessionFactory } from '../../testing/factories';
import { TelehealthworkerDetailComponent } from './telehealthworker-detail.component';


describe('TelehealthworkerDetailComponent', () => {
  let component: TelehealthworkerDetailComponent;
  let fixture: ComponentFixture<TelehealthworkerDetailComponent>;
  let medsessionService: MedsessionService; // new
  const medsession = MedsessionFactory.create();

  class MockActivatedRoute {
    data: Observable<Data> = of({
      medsession
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ TelehealthworkerDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    });
    fixture = TestBed.createComponent(TelehealthworkerDetailComponent);
    component = fixture.componentInstance;
    medsessionService = TestBed.get(MedsessionService);
  });

  it('should update data on initialization', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.medsession).toEqual(medsession);
    });
    component.ngOnInit();
  }));

  it('should update medsession status', () => {
    const spyUpdateMedsession = spyOn(medsessionService, 'updateMedsession');
    component.medsession = MedsessionFactory.create();
    component.updateMedsessionStatus('STARTED');
    expect(spyUpdateMedsession).toHaveBeenCalledWith(component.medsession);
  });


});