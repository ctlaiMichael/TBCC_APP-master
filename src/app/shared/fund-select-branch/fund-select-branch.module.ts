//線上申貸 往來分行(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { FC000104ApiService } from '@api/fc/fc000104/fc000104-api.service';
import { FundSelectBranchComponent } from './fund-select-branch.component';
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //

const Provider = [
  FC000104ApiService
];
const TemplateList = [
  FundSelectBranchComponent
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
export class FundSelectBranchModule { }
