import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExchangePageComponent } from './exchange-page.component';
import { ExchangeCalculatePageComponent } from './exchange-calculate-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'exchange', pathMatch: 'full' },
  { path: 'exchange', component: ExchangePageComponent },
  { path: 'exchangeCalculate', component: ExchangeCalculatePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule { }
