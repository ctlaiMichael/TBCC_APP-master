/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { DateRangeSearchComponent } from './date-range-search.component';
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module'; // 帳戶別相關處理
import { InputDateComponentModule } from '@shared/template/text/input-date/input-date-component.module'; // 日期input
// == 其他template清單 == //
const TemplateList = [
  DateRangeSearchComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    DepositMaskModule,
    InputDateComponentModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
  ]
})
export class DateRangeSearchComponentModule { }
