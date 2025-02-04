import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterSuccessComponent } from './components/register-success/register-success.component';
import { RegisterkeyComponent } from './components/registerkey/registerkey.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { KeyhelpComponent } from './components/registerkey/keyhelp/keyhelp.component';
import { PrivacyPolicyComponent } from './components/login/forgot-password/privacy-policy/privacy-policy.component';
import { LoginHomeComponent } from './components/login-home/login-home.component';
import { ConnectComponent } from '../support/connect/connect.component';
import { ContactComponent } from '../support/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'cookies',
        component: CookiePolicyComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
      { path: 'registerkey', component: RegisterkeyComponent },
      { path: 'registersuccess', component: RegisterSuccessComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'keyhelp', component: ContactComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent, canActivate: [AuthGuard] },

      { path: '', pathMatch: 'full', redirectTo: 'registerkey' }
    ],
    component: LoginHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
