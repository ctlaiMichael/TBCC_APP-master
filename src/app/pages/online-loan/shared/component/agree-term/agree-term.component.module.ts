//線上申貸 同意條款(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { AgreeTermComponent } from './agree-term.component';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { F9000403ApiService } from '@api/f9/f9000403/f9000403-api.service';
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
const Provider = [
  F9000403ApiService
];
const TemplateList = [
  AgreeTermComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
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
export class AgreeTermComponentModule { }
