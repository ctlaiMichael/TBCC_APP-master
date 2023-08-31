//線上申貸 證明文件上傳(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
import { CardUploadComponent } from './card-upload.component';

const Provider = [
];
const TemplateList = [
  CardUploadComponent
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
export class CardUploadModule { }
