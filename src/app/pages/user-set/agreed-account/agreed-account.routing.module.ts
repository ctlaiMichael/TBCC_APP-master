import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgreedAccountPageComponent } from './agreed-account-page.component';
import { ConfirmAccRemovePageComponent } from './confirm-account-remove-page.component';
import { ConfirmAccAddPageComponent } from './add/confirm-account-add-page.component';
import { AddAgreedAcntPageComponent } from './add/add-agreed-acnt-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'agreedAccount', pathMatch: 'full' }
  , { path: 'agreedAccount', component: AgreedAccountPageComponent }
  , { path: 'addAgreed', component: AddAgreedAcntPageComponent }
  , { path: 'addAccountConfirm', component: ConfirmAccAddPageComponent }
  , { path: 'removeAccount', component: ConfirmAccRemovePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreedAccountRoutingModule { }
