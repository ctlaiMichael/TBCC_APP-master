/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { AgreeTermsContentComponent } from './agree-terms-content.component';
// == 其他template清單 == //
const TemplateList = [
  AgreeTermsContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    AgreeTermsContentComponent
  ],
  declarations: [
    AgreeTermsContentComponent
  ],
  providers: [
  ]
})
export class AgreeTermsContentComponentModule { }
