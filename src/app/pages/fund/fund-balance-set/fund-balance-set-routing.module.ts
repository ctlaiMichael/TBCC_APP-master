import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundBalanceSetComponent } from './fund-balance-set.component';
import { FundBalanceSetResultComponent } from './fund-balance-set-result.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  {
    // == 基金停損設定 == //
    path: 'fund-balance-set', component: FundBalanceSetComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金停損設定(結果頁) == //
    path: 'fund-balance-set-result', component: FundBalanceSetResultComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundBalanceSetRoutingModule { }
