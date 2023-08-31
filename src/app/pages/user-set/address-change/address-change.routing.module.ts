import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressChgPageComponent } from './address-change-page.component';
import { ConfirmAddressPageComponent } from './confirm/confirm-address-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'addressChg', pathMatch: 'full' }
  , { path: 'addressChg', component: AddressChgPageComponent }
  , { path: 'confirm', component: ConfirmAddressPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressChangeRoutingModule { }
