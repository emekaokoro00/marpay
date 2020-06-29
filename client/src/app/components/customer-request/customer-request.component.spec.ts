import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MedsessionService } from '../../services/medsession.service';
import { MedsessionFactory } from '../../testing/factories';
import { CustomerRequestComponent } from './customer-request.component';

describe('CustomerRequestComponent', () => {
  let component: CustomerRequestComponent;
  let fixture: ComponentFixture<CustomerRequestComponent>;
  let medsessionService: MedsessionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ CustomerRequestComponent ],
      providers: [ MedsessionService ]
    });
    fixture = TestBed.createComponent(CustomerRequestComponent);
    component = fixture.componentInstance;
    medsessionService = TestBed.get(MedsessionService);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submit', () => {
    const spyCreateMedsession = spyOn(medsessionService, 'createMedsession');
    const spyNavigateByUrl = spyOn(router, 'navigateByUrl');
    component.medsession = MedsessionFactory.create();
    component.onSubmit();
    expect(spyCreateMedsession).toHaveBeenCalledWith(component.medsession);
    expect(spyNavigateByUrl).toHaveBeenCalledWith('/customer');
  });
});
