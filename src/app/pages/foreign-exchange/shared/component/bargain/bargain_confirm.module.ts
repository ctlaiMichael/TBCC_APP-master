/**
 * 
 * 議價匯率
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { BargainConfirmComponent } from './bargain-confirm.component';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000111ApiService } from '@api/f5/f5000111/f5000111-api.service';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { TwdToForeignServiceModule } from '../../service/twd-to-foreign.service.module';
import { TwdToForeignService } from '../../service/twd-to-foreign.service';

// == 其他template清單 == //
const TemplateList = [
  BargainConfirmComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule
    , SelectSecurityModule         // 安控機制
    , CheckSecurityModule         // 安控機制
    , TwdToForeignServiceModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F5000101ApiService,
    F5000102ApiService,
    F5000103ApiService,
    F5000105ApiService,
    F5000109ApiService,
    F2000201ApiService,
    F5000109ApiService,
    F5000110ApiService,
    F5000111ApiService,
    TwdToForeignService
],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
})
export class BargainConfirmModule { }
