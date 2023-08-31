import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeDepositTerminateComponent } from './time-deposit-terminate-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  {
    path: 'edit'
    , component: TimeDepositTerminateComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeDepositTerminateRoutingModule { }
