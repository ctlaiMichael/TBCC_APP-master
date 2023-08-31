import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultComponent } from './result.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'result', pathMatch: 'full' }
  , { path: 'result', component: ResultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSetResultRoutingModule { }
