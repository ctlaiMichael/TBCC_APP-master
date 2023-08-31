/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { BoundResultContentComponent } from './bound-result-content.component';
// == 其他template清單 == //
const TemplateList = [
  BoundResultContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    BoundResultContentComponent
  ],
  declarations: [
    BoundResultContentComponent
  ],
  providers: [
  ]
})
export class BoundResultContentComponentModule { }
