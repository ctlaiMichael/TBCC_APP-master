import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxesPageComponent } from './taxes-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: TaxesPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule { }