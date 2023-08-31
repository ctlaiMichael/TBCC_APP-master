import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';


import { GoldListPageComponent } from './gold-list-page/gold-list-page.component';
import { GoldDetailPageComponent } from './gold-detail-page/gold-detail-page.component';

// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'gold-detail', pathMatch: 'full' },
  { path: 'gold-detail', component: GoldDetailPageComponent },
  { path: 'goldList', component: GoldListPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class GoldDetailRoutingModule { }
