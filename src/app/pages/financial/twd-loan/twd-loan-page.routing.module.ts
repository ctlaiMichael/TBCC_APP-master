import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwdLoanPageComponent } from './twd-loan-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  { path: 'main' , component: TwdLoanPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwdLoanPageRoutingModule { }
