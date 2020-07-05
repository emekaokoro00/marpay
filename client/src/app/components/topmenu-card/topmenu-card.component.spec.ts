import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopmenuCardComponent } from './topmenu-card.component';

describe('TopmenuCardComponent', () => {
  let component: TopmenuCardComponent;
  let fixture: ComponentFixture<TopmenuCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopmenuCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopmenuCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
