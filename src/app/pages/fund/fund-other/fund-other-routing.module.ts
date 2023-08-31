import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RiskTestPageComponent } from './riskTest/risk-test-page.component';
import { PersonCapitalComponent } from '@conf/terms/fund/person-capital/person-capital.component';
import { SafeCheckPageComponent } from './safe-check/safe-check-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
    {
        path: 'resk-test', component: RiskTestPageComponent, data: {},
  },
  // {
  //   path: 'person-capital', component: PersonCapitalComponent, data: {},
  // },
  {
    path: 'safe-check', component: SafeCheckPageComponent, data: {},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
