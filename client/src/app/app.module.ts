import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio'

import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'; //new HttpClientXsrfModule for csrf issue

import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { ToastrModule } from 'ng6-toastr-notifications';

/* Routing Module */
import { AppRoutingModule }   from './app-routing.module';

import { GoogleMapsService } from './services/google-maps.service';
import { AuthService } from './services/auth.service';
import { AuthguardService } from './services/authguard.service';
import { IsCustomer } from './services/is-customer.service';
import { IsTelehealthworker } from './services/is-telehealthworker.service';
import { IsPhysician } from './services/is-physician.service';
import { MedsessionDetailResolver } from './services/medsession-detail.resolver';
import { MedsessionService } from './services/medsession.service';
import { MedsessionListResolver } from './services/medsession-list.resolver';

import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileDetailComponent } from './components/user-profile-detail/user-profile-detail.component';
import { UserProfileUpdateComponent } from './components/user-profile-update/user-profile-update.component';
import { LandingComponent } from './components/landing/landing.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { CustomerRequestComponent } from './components/customer-request/customer-request.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { TelehealthworkerComponent } from './components/telehealthworker/telehealthworker.component';
import { TelehealthworkerDashboardComponent } from './components/telehealthworker-dashboard/telehealthworker-dashboard.component';
import { TelehealthworkerDetailComponent } from './components/telehealthworker-detail/telehealthworker-detail.component';
import { PhysicianComponent } from './components/physician/physician.component';
import { PhysicianDashboardComponent } from './components/physician-dashboard/physician-dashboard.component';
import { PhysicianDetailComponent } from './components/physician-detail/physician-detail.component';
import { MedsessionCardComponent } from './components/medsession-card/medsession-card.component';
import { TopmenuCardComponent } from './components/topmenu-card/topmenu-card.component';
import { DialogaConfirmComponent } from './components/dialogas/dialoga-confirm/dialoga-confirm.component';
import { DialogaAddressConfirmComponent } from './components/dialogas/dialoga-address-confirm/dialoga-address-confirm.component';
import { DialogaSessionDetailsComponent } from './components/dialogas/dialoga-session-details/dialoga-session-details.component';
import { DialogaCallConfirmComponent } from './components/dialogas/dialoga-call-confirm/dialoga-call-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    LandingComponent,
    UserProfileComponent,
    UserProfileDetailComponent,
    UserProfileUpdateComponent,
    CustomerComponent,
    CustomerDashboardComponent,
    CustomerRequestComponent,
    CustomerDetailComponent,
    TelehealthworkerComponent,
    TelehealthworkerDashboardComponent,
    TelehealthworkerDetailComponent,
    PhysicianComponent,
    PhysicianDashboardComponent,
    PhysicianDetailComponent,
    MedsessionCardComponent,
    TopmenuCardComponent,
    DialogaConfirmComponent,
    DialogaAddressConfirmComponent,
    DialogaSessionDetailsComponent,
    DialogaCallConfirmComponent
  ],
  entryComponents: [
     DialogaAddressConfirmComponent
  ],
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' }), //for csrf tken
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,

    AppRoutingModule, // from app-routing.module.ts

    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    	GoogleMapsService,
	AuthguardService, 
	IsCustomer,
	IsTelehealthworker,
	IsPhysician,
	MedsessionService,
	MedsessionListResolver,
	MedsessionDetailResolver,
        // {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
