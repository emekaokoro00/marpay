import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogaCallConfirmComponent } from './dialoga-call-confirm.component';

describe('DialogaCallConfirmComponent', () => {
  let component: DialogaCallConfirmComponent;
  let fixture: ComponentFixture<DialogaCallConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogaCallConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogaCallConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
