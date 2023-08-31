//線上申貸 分行原案件(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { F9000402ApiService } from '@api/f9/f9000402/f9000402-api.service';
import { F9000405ApiService } from '@api/f9/f9000405/f9000405-api.service';
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
import { BranchCaseComponent } from './branch-case.component';


const Provider = [
  F9000402ApiService,
  F9000405ApiService
];
const TemplateList = [
  BranchCaseComponent
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
  entryComponents: [BranchCaseComponent]
})
export class BranchCaseModule { }
