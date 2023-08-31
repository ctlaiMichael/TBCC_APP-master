/**
 * 信用卡(本期)帳單查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { FC001003ApiService } from '@api/fc/fc001003/fc001003-api.service';
import { FC001004ApiService } from '@api/fc/fc001004/fc001004-api.service';
import { FC001009ApiService } from '@api/fc/fc001009/fc001009-api.service';
import { FC001010ApiService } from '@api/fc/fc001010/fc001010-api.service';
// ---------------- Service Start ---------------- //
import { CardQuotaService } from './card-quota.service';


/**
 * 模組清單
 */
const Provider = [
  FC001003ApiService, //額度調整查詢
  FC001004ApiService, //額度調整
  FC001009ApiService, //簡訊密碼請求
  FC001010ApiService, //簡訊密碼驗證
  CardQuotaService
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
export class CardQuotaServiceModule { }
