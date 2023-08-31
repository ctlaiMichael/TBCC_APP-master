/**
 * 存款帳戶-帳戶資訊
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module'; // 帳戶別相關處理

// ---------------- page Start ---------------- //
import { CreditSummaryComponent } from './credit-summary.component';
// ---------------- API Start ---------------- //

// service
import { CreditSummaryService } from './credit-summary.service';

// == 其他template清單 == //
const TemplateList = [
  CreditSummaryComponent
];
const ServiceList = [
  CreditSummaryService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    DepositMaskModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
    ...ServiceList
  ]
})
export class CreditSummaryComponentModule { }
