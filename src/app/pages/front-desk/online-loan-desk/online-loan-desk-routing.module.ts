import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { OnlineLoanDeskPageComponent } from './online-loan-desk-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'loan-test', pathMatch: 'full' }
  , {
    // == 線上申貸測試 == //
    path: 'loan-test', component: OnlineLoanDeskPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineLoanDeskRoutingModule { }