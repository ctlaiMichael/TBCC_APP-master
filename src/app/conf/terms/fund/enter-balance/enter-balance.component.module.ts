/**
 * 停損/獲利點設定注意事項
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { EnterBalanceComponent } from './enter-balance.component';
// == 其他template清單 == //
const TemplateList = [
  EnterBalanceComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    EnterBalanceComponent
  ],
  declarations: [
    EnterBalanceComponent
  ],
  providers: [
  ]
})
export class EnterBalanceComponentModule { }
