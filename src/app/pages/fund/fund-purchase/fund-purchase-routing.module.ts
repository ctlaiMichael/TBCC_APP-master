import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { PurchaseTagPageComponent } from './purchase-tag/purchase-tag-page.component';
import { PurchaseSinglePageComponent } from './purchase-single/purchase-single-page.component';
import { PurchaseRegularPageComponent } from './purchase-regular/purchase-regular-page.component';
import { PurchaseRegularNotPageComponent } from './purchase-regular-not/purchase-regular-not-page.component';
import { PurchaseSingleConfirmPageComponent } from './purchase-single-confirm/purchase-single-confirm-page.component';
import { PurchaseRegularConfirmPageComponent } from './purchase-regular-confirm/purchase-regular-confirm-page.component';
import { PurchaseSingleResultPageComponent } from './purchase-single-result/purchase-single-result-page.component';
import { PurchaseRegularResultPageComponent } from './purchase-regular-result/purchase-regular-result-page.component';
import { PurchaseRegularNotConfirmPageComponent } from './purchase-regular-not-confirm/purchase-regular-not-confirm-page.component';
import { PurchaseRegularNotResultPageComponent } from './purchase-regular-not-result/purchase-regular-not-result-page.component';
import { PurchaseResverSinglePageComponent } from './purchase-resver-single/purchase-resver-single-page.component';
import { PurchaseResverSingleConfirmPageComponent } from './purchase-resver-single-confirm/purchase-resver-single-confirm-page.component';
import { PurchaseResverSingleResultPageComponent } from './purchase-resver-single-result/purchase-resver-single-result-page.component';

const routes: Routes = [
  {
    // == 基金申購(主控tag) == //
    path: 'fund-purchase-tag', component: PurchaseTagPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金單筆申購 == //
    path: 'fund-purchase-single', component: PurchaseSinglePageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金定期定額申購 == //
    path: 'fund-purchase-regular', component: PurchaseRegularPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金定期不定額申購 == //
    path: 'fund-purchase-regular-not', component: PurchaseRegularNotPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金單筆申購(確認頁) == //
    path: 'fund-purchase-single-confirm', component: PurchaseSingleConfirmPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金定期定額申購(確認頁) == //
    path: 'fund-purchase-regular-confirm', component: PurchaseRegularConfirmPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金定期不定額申購(確認頁) == //
    path: 'fund-purchase-regular-not-confirm', component: PurchaseRegularNotConfirmPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金單筆申購(結果頁) == //
    path: 'fund-purchase-single-result', component: PurchaseSingleResultPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金定期定額申購(結果頁) == //
    path: 'fund-purchase-regular-result', component: PurchaseRegularResultPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 基金定期不定額申購(結果頁) == //
    path: 'fund-purchase-regular-not-result', component: PurchaseRegularNotResultPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundPurchaseRoutingModule { }
