/**
 * 贖回說明(廢除)
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { EnterRedeemContentComponent } from './enter-redeem-content.component';
// == 其他template清單 == //
const TemplateList = [
  EnterRedeemContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    EnterRedeemContentComponent
  ],
  declarations: [
    EnterRedeemContentComponent
  ],
  providers: [
  ]
})
export class EnterRedeemContentComponentModule { }
