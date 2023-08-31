/**
 * Route定義
 * epay 交易查詢/退貨
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SearchRecordRoutingModule } from './search-record-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { QRCodeModule } from 'angular2-qrcode';
import { EpayFormateModule } from '@pages/epay/shared/pipe/epay-formate.module'; // epay formate專用
// ---------------- Pages Start ---------------- //
import { SearchRecordComponent } from './search-record.component';
// ---------------- API Start ---------------- //
import { FQ000304ApiService } from '@api/fq/fq000304/fq000304-api.service';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //
import { NgxBarcodeModule } from 'ngx-barcode';


@NgModule({
  imports: [
    SharedModule,
    SearchRecordRoutingModule
    , QRCodeModule
    , EpayFormateModule
    , NgxBarcodeModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000304ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    SearchRecordComponent
  ]
})
export class SearchRecordModule { }
