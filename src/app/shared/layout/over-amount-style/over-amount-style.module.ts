/**
 * 長度樣式處理
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverAmountStyleDirective } from '@shared/layout/over-amount-style/over-amount-style.directive';

/**
 * 模組清單
 */
const Modules = [
  CommonModule
];
const Provider = [
];
const DIRECTIVES = [
  OverAmountStyleDirective
];

@NgModule({
  imports: [
    ...Modules
  ],
  providers: [
    ...Provider
  ],
  declarations: [
    ...DIRECTIVES
  ],
  exports: [
    ...DIRECTIVES
  ]
})
export class OverAmountStyleModule { }
