import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HinetFeePageComponent } from './hinet-fee-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: HinetFeePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HinetFeeRoutingModule { }
