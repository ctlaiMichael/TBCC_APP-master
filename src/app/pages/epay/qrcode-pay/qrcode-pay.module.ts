/**
 * Route定義
 * 繳費
 * qrPay
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { QrcodePayRoutingModule } from './qrcode-pay-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    QrcodePayRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
  ]
})
export class QrcodePayModule { }
