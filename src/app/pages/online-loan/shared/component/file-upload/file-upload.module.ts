//線上申貸 證明文件上傳(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
import { FileUploadComponent } from './file-upload.component';
import { F9000408ApiService } from '@api/f9/f9000408/f9000408-api.service';
import { F9000409ApiService } from '@api/f9/f9000409/f9000409-api.service';

const Provider = [
  F9000408ApiService,
  F9000409ApiService
];
const TemplateList = [
  FileUploadComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    SelectSecurityModule,
    CheckSecurityModule 
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
export class FileUploadModule { }
