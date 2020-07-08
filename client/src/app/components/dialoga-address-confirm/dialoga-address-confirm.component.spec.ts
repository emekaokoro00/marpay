import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogaAddressConfirmComponent } from './dialoga-address-confirm.component';

describe('DialogaAddressConfirmComponent', () => {
  let component: DialogaAddressConfirmComponent;
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
