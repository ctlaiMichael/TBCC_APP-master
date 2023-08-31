import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { ForeignLoanPageComponent } from './foreign-loan-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  { path: 'main' , component: ForeignLoanPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignLoanPageRoutingModule { }
