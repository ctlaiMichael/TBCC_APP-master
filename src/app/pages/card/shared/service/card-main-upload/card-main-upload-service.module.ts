/**
 * 信用卡(本期)帳單查詢
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { CardMainUploadService } from './card-main-upload.service';
import { FC001006ApiService } from '@api/fc/fc001006/fc001006-api.service';
// ---------------- Service Start ---------------- //



/**
 * 模組清單
 */
const Provider = [
  FC001006ApiService, //額度進件狀態查詢
  CardMainUploadService
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
export class CardMainUploadServiceModule { }
