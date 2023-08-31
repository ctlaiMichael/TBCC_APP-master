/**
 * Route定義
 * epay outbound
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { OutboundRoutingModule } from './outbound-routing.module';
import { BoundAgreeContentComponentModule } from '@conf/terms/epay/bound-agree/bound-agree-content-component.module';
import { BoundResultContentComponentModule } from '@conf/terms/epay/bound-result-content/bound-result-content-component.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { EpayFormateModule } from '@pages/epay/shared/pipe/epay-formate.module'; // epay formate專用
// ---------------- Pages Start ---------------- //
import { BoundAgreeComponent } from './bound-agree/bound-agree.component';
import { BoundDataComponent } from './bound-data/bound-data.component';
import { BoundResultComponent } from './bound-result/bound-result.component';
// ---------------- API Start ---------------- //
import { FQ000421ApiService } from '@api/fq/fq000421/fq000421-api.service';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    OutboundRoutingModule,
    BoundAgreeContentComponentModule,
    BoundResultContentComponentModule
    , EpayFormateModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000421ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    BoundAgreeComponent
    , BoundDataComponent
    , BoundResultComponent
  ]
})
export class OutboundModule { }
