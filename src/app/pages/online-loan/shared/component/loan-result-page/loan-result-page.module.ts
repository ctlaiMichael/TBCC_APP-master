//線上申貸 結果頁(共用)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { LoanResultPageComponent } from './loan-result-page.component';
import { F9000501ApiService } from '@api/f9/f9000501/f9000501-api.service';
import { F9000503ApiService } from '@api/f9/f9000503/f9000503-api.service';
import { DownloadService } from '../../service/download.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';

// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
// == 其他template清單 == //
const Provider = [
  F9000501ApiService,
  F9000503ApiService,
  DownloadService,
  SocialsharingPluginService
];
const TemplateList = [
  LoanResultPageComponent
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
export class LoanResultPageModule { }
