import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyAccountPageComponent } from './modify/modify-account-page.component';
import { ConfirmAccModifyPageComponent } from './modify/confirm-account-modify-page.component';
import { AddAccountPageComponent } from './modify/add-account-page.component';
import { CommonAccountPageComponent } from './common-account-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'commonAccount', pathMatch: 'full' }
  , { path: 'commonAccount', component: CommonAccountPageComponent }
  , { path: 'modifyAccount', component: ModifyAccountPageComponent }
  , { path: 'modifyConfirm', component: ConfirmAccModifyPageComponent }
  , { path: 'addAccount', component: AddAccountPageComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonAccountRoutingModule { }
