//線上申貸 kyc表(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { KycFillPageComponent } from './kyc-fill-page.component';
import { SharedModule } from '@shared/shared.module';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
const Provider = [
];
const TemplateList = [
KycFillPageComponent
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
export class KycFillPageModule { }
