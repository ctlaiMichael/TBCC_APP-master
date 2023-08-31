/**
 * 分頁機制
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorCtrlService } from './paginator-ctrl.srevice';
import { PaginatorCtrlDirective } from '@shared/paginator/paginator-ctrl.directive';

/**
 * 模組清單
 */
const Modules = [
  CommonModule
];
const Provider = [
  PaginatorCtrlService
];
const DIRECTIVES = [
  PaginatorCtrlDirective
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
export class PaginatorCtrlModule { }
