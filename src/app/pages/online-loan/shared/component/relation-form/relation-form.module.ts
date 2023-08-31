//線上申貸 同一關係人(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { RelationFormComponent } from './relation-form.component';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
const Provider = [
];
const TemplateList = [
  RelationFormComponent
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
export class RelationFormModule { }
