//線上申貸 往來分行(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { SelectBranchModule } from '@shared/select-branch/select-branch.module';
import { CreditBranchCaseModule } from '../credit-branch-case/credit-branch-case.module';
// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { FC000104ApiService } from '@api/fc/fc000104/fc000104-api.service';
import { F9000505ApiService } from '@api/f9/f9000505/f9000505-api.service';
import { F9000410ApiService } from '@api/f9/f9000410/f9000410-api.service';
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
import { ContactBranchComponent } from './contact-branch.component';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { CaptchaModule } from '@shared/captcha/captcha.moudle';

const Provider = [
  FC000104ApiService,
  F9000505ApiService,
  F9000410ApiService
];
const TemplateList = [
  ContactBranchComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    SelectBranchModule, //自行選擇
    CreditBranchCaseModule, //原存款分行 f2000101
    PaginatorCtrlModule,
    CaptchaModule
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
export class ContactBranchModule { }
