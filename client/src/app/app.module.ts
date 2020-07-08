import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';



import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'; //new HttpClientXsrfModule for csrf issue

import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { ToastrModule } from 'ng6-toastr-notifications';

import { GoogleMapsService } from './services/google-maps.service';
import { AuthService } from './services/auth.service';
import { IsCustomer } from './services/is-customer.service';
import { IsTelehealthworker } from './services/is-telehealthworker.service';
import { MedsessionDetailResolver } from './services/medsession-detail.resolver';
import { MedsessionService } from './services/medsession.service';
import { MedsessionListResolver } from './services/medsession-list.resolver';

import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { LandingComponent } from './components/landing/landing.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { CustomerRequestComponent } from './components/customer-request/customer-request.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { MedsessionCardComponent } from './components/medsession-card/medsession-card.component';
import { TelehealthworkerComponent } from './components/telehealthworker/telehealthworker.component';
import { TelehealthworkerDashboardComponent } from './components/telehealthworker-dashboard/telehealthworker-dashboard.component';
import { TelehealthworkerDetailComponent } from './components/telehealthworker-detail/telehealthworker-detail.component';
import { TopmenuCardComponent } from './components/topmenu-card/topmenu-card.component';
import { DialogaAddressConfirmComponent } from './components/dialoga-address-confirm/dialoga-address-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    LandingComponent,
    CustomerComponent,
    CustomerDashboardComponent,
    CustomerRequestComponent,
    CustomerDetailComponent,
    MedsessionCardComponent,
    TelehealthworkerComponent,
    TelehealthworkerDashboardComponent,
    TelehealthworkerDetailComponent,
    TopmenuCardComponent,
    DialogaAddressConfirmComponent
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

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,


    //MatDialog, 
    //MatDialogRef, 
    // MAT_DIALOG_DATA,
    FormsModule,
    RouterModule.forRoot([
      //{ path: '', component: LandingComponent },
      {     path: '', 
	    component: LandingComponent,
	    resolve: { medsessions: MedsessionListResolver }
      },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'log-in', component: LogInComponent },
      {     path: 'customer', 
	    component: CustomerComponent , 
	    canActivate: [ IsCustomer ],
	    children: [
	      { path: 'request', 
		component: CustomerRequestComponent
	      },
	      { path: ':id', 
		component: CustomerDetailComponent,
        	resolve: { medsession: MedsessionDetailResolver }
	      },
	      { path: '', 
		component: CustomerDashboardComponent,
		resolve: { medsessions: MedsessionListResolver }
	      }
	    ]
      },
      {     path: 'telehealthworker', 
	    component: TelehealthworkerComponent,
            canActivate: [ IsTelehealthworker ],
	    children: [
	      {
	        path: ':id',
	        component: TelehealthworkerDetailComponent,
	        resolve: { medsession: MedsessionDetailResolver }
	      },
	      {
	        path: '',
	        component: TelehealthworkerDashboardComponent,
	        resolve: { medsessions: MedsessionListResolver }
	      }
	    ]
      }
    ], { useHash: true }),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    	GoogleMapsService,
	AuthService, 
	IsCustomer,
	IsTelehealthworker,
	MedsessionService,
	MedsessionListResolver,
	MedsessionDetailResolver,
        // {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
