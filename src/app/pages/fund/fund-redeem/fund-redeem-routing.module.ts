import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { RedeemMainComponent } from './redeem-main/redeem-main-page.component';
import { RedeemEdit1PageComponent } from './redeem-edit1/redeem-edit1-page.component';
import { RedeemEdit2PageComponent } from './redeem-edit2/redeem-edit2-page.component';
import { RedeemConfirmPageComponent } from './redeem-confirm/redeem-confirm-page.component';
import { RedeemResultPageComponent } from './redeem-result/redeem-result-page.component';

const routes: Routes = [
  {
    // == 基金贖回(主控) == //
    path: 'fund-redeem-main', component: RedeemMainComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金贖回(編輯頁1) == //
    path: 'fund-redeem-edit1', component: RedeemEdit1PageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金贖回(編輯頁2) == //
    path: 'fund-redeem-edit2', component: RedeemEdit2PageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金贖回(確認頁) == //
    path: 'fund-redeem-confirm', component: RedeemConfirmPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金贖回(結果) == //
    path: 'fund-redeem-result', component: RedeemResultPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundRedeemRoutingModule { }
