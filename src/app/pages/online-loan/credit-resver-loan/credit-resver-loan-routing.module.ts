import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { CreditResverLoanMainComponent } from './credit-resver-loan-main/credit-resver-loan-main.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    // == 主頁 == //
    path: 'main', component: CreditResverLoanMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditResverLoanRoutingModule { }