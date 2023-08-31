/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { BoundAgreeContentComponent } from './bound-agree-content.component';
// == 其他template清單 == //
const TemplateList = [
  BoundAgreeContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    BoundAgreeContentComponent
  ],
  declarations: [
    BoundAgreeContentComponent
  ],
  providers: [
  ]
})
export class BoundAgreeContentComponentModule { }
