import {
  HttpClientTestingModule, HttpTestingController, TestRequest
} from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { UserFactory } from '../../testing/factories';
import { LandingComponent } from './landing.component';

import { TopmenuCardComponent } from '../../components/topmenu-card/topmenu-card.component';

describe('LandingComponent', () => {
  let logOutButton: DebugElement;
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ 
	LandingComponent,
	TopmenuCardComponent	
	 ],
      providers: [ AuthService ]
    });
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create()
    ));
    fixture.detectChanges();
    logOutButton = fixture.debugElement.query(By.css('button.btn.btn-primary'));
  });

  it('should allow a user to log out of an account', () => { //to make this pass, reemove the *ngif from html
    logOutButton.triggerEventHandler('click', null);
    const request: TestRequest = httpMock.expectOne('/api/log_out/');
    request.flush({});
    expect(localStorage.getItem('marpay.user')).toBeNull();
  });

  it('should indicate whether a user is logged in', () => {
    localStorage.clear();
    expect(component.getUser()).toBeFalsy();
    localStorage.setItem('marpay.user', JSON.stringify(
      UserFactory.create()
    ));
    expect(component.getUser()).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
