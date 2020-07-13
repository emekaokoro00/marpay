import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianDashboardComponent } from './physician-dashboard.component';

describe('PhysicianDashboardComponent', () => {
  let component: PhysicianDashboardComponent;
  let fixture: ComponentFixture<PhysicianDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
