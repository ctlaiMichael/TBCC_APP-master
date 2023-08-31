/**
 * 繳費
 * qrPay
 * 繳卡費
 * 中華電信費
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { PayCardComponent } from './pay-card.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  // 繳卡費 (原： qrCodePayFormCard)
  , {
    // qrPay/card/main
    path: 'main', component: PayCardComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayCardRoutingModule { }
