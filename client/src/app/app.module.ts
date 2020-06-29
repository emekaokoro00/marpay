import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { IsCustomer } from './services/is-customer.service';
import { MedsessionService } from './services/medsession.service';
import { MedsessionListResolver } from './services/medsession-list.resolver';

import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { LandingComponent } from './components/landing/landing.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    LandingComponent,
    CustomerComponent,
    CustomerDashboardComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot([
      { path: 'sign-up', component: SignUpComponent },
      { path: 'log-in', component: LogInComponent },
      { path: 'customer', component: CustomerComponent , canActivate: [ IsCustomer ],
	    children: [
	      { path: '', 
		component: CustomerDashboardComponent,
		resolve: { medsessions: MedsessionListResolver }
		 }
	    ]
      },
      { path: '', component: LandingComponent }
    ], { useHash: true })
  ],
  providers: [
	AuthService, 
	IsCustomer,
	MedsessionService,
	MedsessionListResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
