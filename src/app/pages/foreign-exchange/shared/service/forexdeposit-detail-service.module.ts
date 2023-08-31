/**
 * 台幣存款查詢-交易明細查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { F2100201ApiService } from '@api/f2/f2100201/f2100201-api.service';
import { F2100202ApiService } from '@api/f2/f2100202/f2100202-api.service';
// ---------------- Service Start ---------------- //
import { ForeignDepositService } from './foreign-deposit.service';

/**
 * 模組清單
 */
const Provider = [
  // 台幣帳戶明細查詢
  F2100201ApiService, // 活綜支存
  F2100202ApiService, // 定存
  ForeignDepositService
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
export class ForexdepositDetailServiceModule { }
