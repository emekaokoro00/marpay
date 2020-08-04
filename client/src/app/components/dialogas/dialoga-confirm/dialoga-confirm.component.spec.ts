import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogaConfirmComponent } from './dialoga-confirm.component';

describe('DialogaConfirmComponent', () => {
  let component: DialogaConfirmComponent;
  let fixture: ComponentFixture<DialogaConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogaConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogaConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
