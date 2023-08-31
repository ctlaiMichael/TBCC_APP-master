import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectricityPageComponent } from './electricity-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: ElectricityPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectricityRoutingModule { }