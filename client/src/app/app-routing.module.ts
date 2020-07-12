import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './services/auth.service';
import { AuthguardService } from './services/authguard.service';
import { IsCustomer } from './services/is-customer.service';
import { IsTelehealthworker } from './services/is-telehealthworker.service';
import { MedsessionDetailResolver } from './services/medsession-detail.resolver';
import { MedsessionService } from './services/medsession.service';
import { MedsessionListResolver } from './services/medsession-list.resolver';
 
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
import { DialogaSessionDetailsComponent } from './components/dialogas/dialoga-session-details/dialoga-session-details.component';
 
 
export const appRoutes: Routes = [
      //{ path: '', component: LandingComponent },
      {     path: '', 
	    component: LandingComponent,
	    canActivate: [ AuthguardService ],
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
];
 
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true} )],
  exports: [RouterModule]
})
 
export class AppRoutingModule {}