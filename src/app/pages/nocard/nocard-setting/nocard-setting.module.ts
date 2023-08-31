import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NocardSettingRoutingModule } from "./nocard-setting-routing.module";
import { OtpModule } from "@shared/transaction-security/otp-popup/otp.module";
import { NocardAgreementPageComponent } from "./nocard-agreement-page/nocard-agreement-page.component";
import { NocardAddAccountPageComponent } from "./nocard-add-account-page/nocard-add-account-page.component";
import { NocardConfirmPageComponent } from "./nocard-confirm-page/nocard-confirm-page.component";
import { NocardAccountService } from '../shared/service/nocard-account.service';
import { FN000101ApiService } from '@api/fn/fn000101/fn000101-api.service';
import { FN000103ApiService } from '@api/fn/fn000103/fn000103-api.service';
import { OtpServiceService } from '@pages/security/shared/service/otp-service.service';
import { Logger } from '@core/system/logger/logger.service';
import { F1000108ApiService } from '@api/f1/f1000108/f1000108-api.service';

@NgModule({
  imports: [SharedModule, CommonModule, NocardSettingRoutingModule, OtpModule],
  providers: [
    FN000101ApiService,
    FN000103ApiService,
    NocardAccountService,
    OtpServiceService,
    F1000108ApiService,
    Logger
  ],
  declarations: [
    NocardAgreementPageComponent,
    NocardAddAccountPageComponent,
    NocardConfirmPageComponent
  ]
})
export class NocardSettingModule {}
