/**
 * 當日匯入匯款查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { F2000401ApiService } from '@api/f2/f2000401/f2000401-api.service';
import { F2000402ApiService } from '@api/f2/f2000402/f2000402-api.service';

// ---------------- Service Start ---------------- //
import { DayRemittanceService } from '@pages/deposit/shared/service/day-remittance.service';

/**
 * 模組清單
 */
const Provider = [
  // 台幣帳戶明細查詢
    F2000401ApiService, // 活綜支存
    F2000402ApiService, // 定存
    DayRemittanceService
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
export class DayRemittanceServiceModule { }
