import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaunderPreventionComponent } from './launder-prevention.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
   , { path: 'main', component: LaunderPreventionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunderPreventionRoutingModule { }
