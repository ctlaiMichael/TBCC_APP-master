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
import { ContentSummaryComponent } from './content-summary.component';
// ---------------- API Start ---------------- //
// 台幣帳戶明細彙總
import { F2100103ApiService } from '@api/f2/f2100103/f2100103-api.service';
import { F2100104ApiService } from '@api/f2/f2100104/f2100104-api.service';
import { F2100106ApiService } from '@api/f2/f2100106/f2100106-api.service';
// 黃金
// import { FB000707ApiService } from '@api/fb/fb000707/fb000707-api.service';

// service
import { ContentSummaryService } from '@shared/template/deposit/content-summary/content-summary.service';

// == 其他template清單 == //
const TemplateList = [
  ContentSummaryComponent
];
const ServiceList = [

  // 台幣帳戶明細彙總
  F2100103ApiService, // 活存
  F2100104ApiService, // 支存
  F2100106ApiService, // 綜存
  // 外匯帳戶明細彙總

  // 黃金
  // FB000707ApiService, // 黃金

  ContentSummaryService
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
export class ContentSummaryComponentModule { }
