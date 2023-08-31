import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { DayRemitListMainPageComponent } from './day-remit-list-mainpage/day-remit-lsit-mainpage.component';


const routes: Routes = [
  { path: '', redirectTo: 'day-remittance', pathMatch: 'full' },
  {
    path: 'day-remittance'
      , component: DayRemitListMainPageComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DayRemittanceRoutingModule { }
