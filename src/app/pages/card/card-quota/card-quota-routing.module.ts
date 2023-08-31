import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardQuotaMenuComponent } from './card-quota-menu.component';
import { CardQuotaComponent } from './card-quota-main/card-quota.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'card-quota-menu', pathMatch: 'full' },
  {
    // == 額度調整-選單 == //
    path: 'card-quota-menu', component: CardQuotaMenuComponent
  },
  {
    // == 額度調整 == //
    path: 'card-quota', component: CardQuotaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardQuotaRoutingModule { }
