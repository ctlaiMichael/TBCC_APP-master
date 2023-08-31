/**
 * 繳費
 * qrPay
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  // 繳卡費 (原： qrCodePayFormCard)
  {
    path: 'card', loadChildren: './pay-card/pay-card.module#PayCardModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodePayRoutingModule { }
