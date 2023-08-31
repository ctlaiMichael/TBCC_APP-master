import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { ReservationInquiryComponent } from './inquiry/reservation-inquiry-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'reservation-inquiry', pathMatch: 'full' },
  {
    path: 'reservation-inquiry'
    , component: ReservationInquiryComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationInquiryRoutingModule { }
