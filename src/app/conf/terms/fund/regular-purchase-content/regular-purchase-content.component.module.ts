/**
 * 定期定額申購說明
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { RegularPurchaseContentComponent } from './regular-purchase-content.component';
// == 其他template清單 == //
const TemplateList = [
    RegularPurchaseContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    RegularPurchaseContentComponent
  ],
  declarations: [
    RegularPurchaseContentComponent
  ],
  providers: [
  ]
})
export class RegularPurchaseContentComponentModule { }
