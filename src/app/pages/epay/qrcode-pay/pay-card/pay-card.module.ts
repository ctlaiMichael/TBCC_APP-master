/**
 * Route定義
 * 繳費-繳卡費
 * qrPay
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { PayCardRoutingModule } from './pay-card-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { EpayFormateModule } from '@pages/epay/shared/pipe/epay-formate.module'; // epay formate專用

// ---------------- Pages Start ---------------- //
import { PayCardComponent } from './pay-card.component';
// ---------------- API Start ---------------- //
import { FQ000107ApiService } from '@api/fq/fq000107/fq000107-api.service';
import { FQ000117ApiService } from '@api/fq/fq000117/fq000117-api.service';
// ---------------- Service Start ---------------- //
import { PayCardService } from '@pages/epay/shared/service/pay-card.service';
import { OnscanService } from '@pages/epay/shared/service/onscan.service';
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    PayCardRoutingModule
    , EpayFormateModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    PayCardService
    , FQ000107ApiService
    , FQ000117ApiService,
    OnscanService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    PayCardComponent
  ]
})
export class PayCardModule { }
