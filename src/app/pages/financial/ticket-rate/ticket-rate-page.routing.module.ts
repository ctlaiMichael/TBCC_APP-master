import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketRatePageComponent } from './ticket-rate-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  { path: 'main' , component: TicketRatePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRatePageRoutingModule { }
