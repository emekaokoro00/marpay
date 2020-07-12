import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogaSessionDetailsComponent } from './dialoga-session-details.component';

describe('DialogaSessionDetailsComponent', () => {
  let component: DialogaSessionDetailsComponent;
  let fixture: ComponentFixture<DialogaSessionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogaSessionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogaSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
