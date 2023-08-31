/**
 * 信用卡選單
 */
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
// ---------------- Service Start ---------------- //
import { CardMenuService } from './card-menu.service';

/**
 * 模組清單
 */
const Provider = [
  CardMenuService
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
export class CardMenuServiceModule { }
