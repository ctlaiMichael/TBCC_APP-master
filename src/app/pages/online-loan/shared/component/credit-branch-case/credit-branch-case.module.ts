//線上申貸 分行原案件(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service';
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
import { CreditBranchCaseComponent } from './credit-branch-case.component';

const Provider = [
  F2000101ApiService
];
const TemplateList = [
  CreditBranchCaseComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
    ...Provider
  ],
  entryComponents: [CreditBranchCaseComponent]
})
export class CreditBranchCaseModule { }
