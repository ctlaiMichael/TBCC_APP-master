/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { FI000402ApiService } from '@api/fi/fI000402/fI000402-api.service';
// ---------------- Shared Start ---------------- //
import { FundSubjectComponent } from './fund-subject.component';
// == 其他template清單 == //
const Provider = [
  FI000402ApiService
];
const TemplateList = [
  FundSubjectComponent
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
  ]
})
export class FundSubjectComponentModule { }
