/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { EnterAgreeContentComponent } from './enter-agree-content.component';
// == 其他template清單 == //
const TemplateList = [
  EnterAgreeContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    EnterAgreeContentComponent
  ],
  declarations: [
    EnterAgreeContentComponent
  ],
  providers: [
  ]
})
export class EnterAgreeContentComponentModule { }
