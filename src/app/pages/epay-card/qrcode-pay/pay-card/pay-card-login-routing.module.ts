/**
 * 繳費
 * qrPay
 * 繳卡費
 * 中華電信費
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { PayCardLoginComponent } from './pay-card-login.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  // 繳卡費 (原： qrCodePayFormCard)
  , {
    // qrPay/card/main
    path: 'main', component: PayCardLoginComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayCardRoutingModule { }
