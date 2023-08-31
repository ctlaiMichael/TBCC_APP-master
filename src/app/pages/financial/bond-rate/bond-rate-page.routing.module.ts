import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BondRatePageComponent } from './bond-rate-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  { path: 'main' , component: BondRatePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BondRatePageRoutingModule { }
