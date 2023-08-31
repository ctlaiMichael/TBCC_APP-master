/**
 * Route定義
 * 繳費
 * qrPay
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { QrcodePayCardRoutingModule } from './qrcode-pay-card-routing.module';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';

// ---------------- Pages Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    QrcodePayCardRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    QRTpyeService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
  ]
})
export class QrcodePayCardModule { }
