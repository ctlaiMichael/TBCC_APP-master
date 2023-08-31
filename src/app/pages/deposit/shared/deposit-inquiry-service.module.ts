/**
 * 存款查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service'; // 台幣存款
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service'; // 外幣存款
import { F2000501ApiService } from '@api/f2/f2000501/f2000501-api.service'; // 我的金庫
// ---------------- Shared Start ---------------- //
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service';

/**
 * 模組清單
 */
const Provider = [
  // 台幣存款查詢
  F2000101ApiService
  // 外幣存款查詢
  , F2000201ApiService
  // 我的金庫
  , F2000501ApiService
  // 黃金存款查詢
  // Service
  , DepositInquiryService
];
const PipiList = [
];


@NgModule({
  imports: [
  ],
  providers: [
    ...Provider
  ],
  declarations: [
    ...PipiList
  ],
  exports: [
    ...PipiList
  ]
})
export class DepositInquiryServiceModule { }
