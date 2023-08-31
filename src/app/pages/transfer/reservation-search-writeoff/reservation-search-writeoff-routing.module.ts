import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationSearchWriteoffPageComponent } from './reservation-search-writeoff-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'reservation-search-writeoff', component: ReservationSearchWriteoffPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationSearchWriteoffRoutingModule { }
