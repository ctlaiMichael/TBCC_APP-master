/**
 * 單筆申購說明
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { SinglePurchaseContentComponent } from './single-purchase-content.component';
// == 其他template清單 == //
const TemplateList = [
SinglePurchaseContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    SinglePurchaseContentComponent
  ],
  declarations: [
    SinglePurchaseContentComponent
  ],
  providers: [
  ]
})
export class SinglePurchaseContentComponentModule { }
