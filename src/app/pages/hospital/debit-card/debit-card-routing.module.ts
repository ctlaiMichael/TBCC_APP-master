import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { NtuhMenuPageComponent } from '@pages/hospital/ntuh/ntuh-menu/ntuh-menu-page.component';
import { NtuhPayComponent } from '@pages/hospital/ntuh/ntuh-pay/ntuh-pay-page.component';
import { DebitCardPageComponent } from './debit-card-page.component';
import { MatmBackPageComponent } from '../matm-back/matm-back-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'debit-card', pathMatch: 'full' }
  , {
    // == 繳費單繳費 == //
    path: 'debit-card', component: DebitCardPageComponent
    // ,canActivate: [LogoutRequired]
  }
  // , {
  //   // == 繳費單繳費 == //
  //   path: 'mamt-back', component: MatmBackPageComponent
  //   // ,canActivate: [LogoutRequired]
  // }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitCardRoutingModule { }