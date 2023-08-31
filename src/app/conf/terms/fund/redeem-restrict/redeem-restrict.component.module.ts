/**
 * 贖回限制說明
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { RedeemRestrictComponent } from './redeem-restrict.component';
// == 其他template清單 == //
const TemplateList = [
  RedeemRestrictComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    RedeemRestrictComponent
  ],
  declarations: [
    RedeemRestrictComponent
  ],
  providers: [
  ]
})
export class RedeemRestrictComponentModule { }
