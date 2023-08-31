/**
 * 定期定額套餐說明
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { RegularPurchaseCodeComponent } from './regular-purchase-code.component';
// == 其他template清單 == //
const TemplateList = [
  RegularPurchaseCodeComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    RegularPurchaseCodeComponent
  ],
  declarations: [
    RegularPurchaseCodeComponent
  ],
  providers: [
  ]
})
export class RegularPurchaseCodeComponentModule { }
