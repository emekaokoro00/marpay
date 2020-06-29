import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { MedsessionService } from '../../services/medsession.service';
import { MedsessionFactory } from '../../testing/factories';
import { TelehealthworkerDashboardComponent } from './telehealthworker-dashboard.component';
import { MedsessionCardComponent } from '../../components/medsession-card/medsession-card.component';


describe('TelehealthworkerDashboardComponent', () => {
  let component: TelehealthworkerDashboardComponent;
  let fixture: ComponentFixture<TelehealthworkerDashboardComponent>;
  const medsession1 = MedsessionFactory.create({session_telehealthworker: null});
  const medsession2 = MedsessionFactory.create({status: 'COMPLETED'});
  const medsession3 = MedsessionFactory.create({status: 'IN_PROGRESS'});

  class MockActivatedRoute {
    data: Observable<Data> = of({
      medsessions: [medsession1, medsession2, medsession3]
    });
  }

  class MockMedsessionService { // new
    messages: Observable<any> = of();
    connect(): void {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        TelehealthworkerDashboardComponent,
        MedsessionCardComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: MedsessionService, useClass: MockMedsessionService }
      ]
    });
    fixture = TestBed.createComponent(TelehealthworkerDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should get current medsessions', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentMedsessions).toEqual([medsession3]);
    });
    component.ngOnInit();
  }));

  it('should get requested medsessions', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.requestedMedsessions).toEqual([medsession1]);
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
