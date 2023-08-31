/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
// ---------------- Model Start ---------------- //
import { OverAmountStyleModule } from '@shared/layout/over-amount-style/over-amount-style.module'; // 長度樣式處理
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
import { CardBillServiceModule } from '@pages/card/shared/service/card-bill-service/card-bill-service.module';
import { HomeCardComponent } from './home-card.component';

// == 其他template清單 == //
const Provider = [
];
const TemplateList = [
  HomeCardComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    OverAmountStyleModule,
    CardBillServiceModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
    ...Provider
  ]
})
export class HomeCardComponentModule { }
