/**
 * 信用卡(本期)帳單查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { FC000403ApiService } from '@api/fc/fc000403/fc000403-api.service';
import { F8000402ApiService } from '@api/f8/f8000402/f8000402-api.service';
import { F8000401ApiService } from '@api/f8/f8000401/f8000401-api.service';
// ---------------- Service Start ---------------- //
import { CardBillService } from './card-bill.service';
import { FC000404ApiService } from '@api/fc/fc000404/fc000404-api.service';

/**
 * 模組清單
 */
const Provider = [
  FC000403ApiService, // 本期帳單
  F8000402ApiService, // 轉出帳號
  F8000401ApiService, //合庫本人繳卡費
  FC000404ApiService, //超商繳卡費
  CardBillService
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
export class CardBillServiceModule { }
