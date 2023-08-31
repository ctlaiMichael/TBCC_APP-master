/**
 * 定期定額申購說明
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { FundAmountContentComponent } from './fund-amount-content.component';
// == 其他template清單 == //
const TemplateList = [
    FundAmountContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    FundAmountContentComponent
  ],
  declarations: [
    FundAmountContentComponent
  ],
  providers: [
  ]
})
export class FundAmountContentComponentModule { }
