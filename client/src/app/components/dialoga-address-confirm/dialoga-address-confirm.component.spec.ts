import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogaAddressConfirmComponent } from './dialog-address-confirm.component';

describe('DialogaAddressConfirmComponent', () => {
  let component: DialogAddressConfirmComponent;
  let fixture: ComponentFixture<DialogaAddressConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogaAddressConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogaAddressConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
