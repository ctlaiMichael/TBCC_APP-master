import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaborHealthNationalPageComponent } from './labor-health-national-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: LaborHealthNationalPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaborHealthNationalRoutingModule { }