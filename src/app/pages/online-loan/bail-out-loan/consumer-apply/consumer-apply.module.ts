//線上申貸 消費者貸款申請書(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { ConsumerApplyComponent } from './consumer-apply.component';
import { SharedModule } from '@shared/shared.module';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
const Provider = [
];
const TemplateList = [
  ConsumerApplyComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    SharedModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
    ...Provider
  ]
})
export class ConsumerApplyModule { }
