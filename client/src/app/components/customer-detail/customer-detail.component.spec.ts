import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { MedsessionFactory } from '../../testing/factories';
import { CustomerDetailComponent } from './customer-detail.component';

describe('CustomerDetailComponent', () => {
  let component: CustomerDetailComponent;
  let fixture: ComponentFixture<CustomerDetailComponent>;
  const medsession = MedsessionFactory.create();

  class MockActivatedRoute {
    data: Observable<Data> = of({
      medsession
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ CustomerDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    });
    fixture = TestBed.createComponent(CustomerDetailComponent);
    component = fixture.componentInstance;
  });

  it('should update data on initialization', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.medsession).toEqual(medsession);
    });
    component.ngOnInit();
  }));
});
