/**
 * 勞工紓困貸款
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { BailOutLoanMainComponent } from './bail-out-loan-main/bail-out-loan-main.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    // == 主頁 == //
    path: 'main', component: BailOutLoanMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BailOutLoanRoutingModule { }
