import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddressConfirmComponent } from './dialog-address-confirm.component';

describe('DialogAddressConfirmComponent', () => {
  let component: DialogAddressConfirmComponent;
  let fixture: ComponentFixture<DialogAddressConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddressConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddressConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
