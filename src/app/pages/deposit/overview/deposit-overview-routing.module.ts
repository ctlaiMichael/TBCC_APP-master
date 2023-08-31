import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewMainPageComponent } from './overview-mainpage/overview-mainpage.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview'
      , component: OverviewMainPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositOverviewRoutingModule { }
