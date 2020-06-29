import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';

import { Observable, of } from 'rxjs';

import { MedsessionFactory } from '../../testing/factories';
import { CustomerDashboardComponent } from './customer-dashboard.component';

describe('CustomerDashboardComponent', () => {
  let component: CustomerDashboardComponent;
  let fixture: ComponentFixture<CustomerDashboardComponent>;

  const medsession1 = MedsessionFactory.create({session_telehealthworker: null});
  const medsession2 = MedsessionFactory.create({status: 'COMPLETED'});
  const medsession3 = MedsessionFactory.create();

  class MockActivatedRoute {
    data: Observable<Data> = of({
      medsessions:  [medsession1, medsession2, medsession3]
    });
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDashboardComponent ],
      // new
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    });
    fixture = TestBed.createComponent(CustomerDashboardComponent);
    component = fixture.componentInstance;
  }));

  it('should get current medsessions', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentMedsessions).toEqual([medsession3]);
    });
    component.ngOnInit();
  }));

  it('should get completed medsessions', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.completedMedsessions).toEqual([medsession2]);
    });
    component.ngOnInit();
  }));

});
