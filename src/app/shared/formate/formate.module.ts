/**
 * formate Module
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == 字串常用pipe == //
import { StringFormateModule } from './string/string-formate.module';
// == 數值常用pipe == //
import { NumberFormateModule } from './number/number-formate.module';
import { AmountFormateModule } from './number/amount/amount-formate.module';

// == 日期常用pipe == //
import { DateFormateModule } from './date/date-formate.module';
// == 物件常用pipe == //
import { ObjectFormateModule } from './object/object-formate.module';
// == View特殊處理 == //
import { ViewFormateModule } from './view/view-formate.module';
// == mask == //
// --- [帳號類] --- //
import { AccountMaskModule } from './mask/account/account-mask.module';
// == 其他pipe清單 == //
const PipeList = [
];
const ModuleList = [
  StringFormateModule
  , NumberFormateModule
  , DateFormateModule
  , ObjectFormateModule
  , ViewFormateModule
  , AccountMaskModule
  , AmountFormateModule
];

@NgModule({
  imports: [
    ...ModuleList
  ],
  exports: [
    ...ModuleList,
    ...PipeList
  ],
  declarations: [
    ...PipeList
  ],
  providers: []
})
export class FormateModule { }
