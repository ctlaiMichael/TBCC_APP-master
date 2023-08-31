/**
 * 台幣存款查詢-交易明細查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { F2100101ApiService } from '@api/f2/f2100101/f2100101-api.service';
import { F2100102ApiService } from '@api/f2/f2100102/f2100102-api.service';
import { F2100105ApiService } from '@api/f2/f2100105/f2100105-api.service';
// ---------------- Service Start ---------------- //
import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';

/**
 * 模組清單
 */
const Provider = [
  // 台幣帳戶明細查詢
  F2100101ApiService, // 活支存
  F2100102ApiService, // 定存
  F2100105ApiService, // 綜存
  DepositInquiryDetailService
];

@NgModule({
  imports: [
  ],
  providers: [
    ...Provider
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class DepositDetailServiceModule { }
