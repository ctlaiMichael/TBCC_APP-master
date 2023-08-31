import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CheckService } from '@shared/check/check.service';
import { NoPredesignatedRoutingModule } from './no-predesignated-routing.module';
import { A11yOtpSecurityModule } from '@pages/a11y/transaction-security/a11y-otp-security/a11y-otp-security.module';
import { NoPredesignatedResultPageComponent } from './no-predesignated-result-page/no-predesignated-result-page.component';
import { NoPredesignatedConfirmPageComponent } from './no-predesignated-confirm-page/no-predesignated-confirm-page.component';
import { NoPredesignatedTransferPageComponent } from './no-predesignated-transfer-page/no-predesignated-transfer-page.component';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module'
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { CaService } from '@shared/transaction-security/ca-popup/ca.service';
import { TwdTransferService } from '@pages/transfer/shared/service/twdTransfer.service';
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { NumbersOnlyDirective } from './shared/numbers-only.directive';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@NgModule({
  imports: [
    SharedModule,
    CheckSecurityModule,
    NoPredesignatedRoutingModule,
    A11yOtpSecurityModule
  ],
  providers: [
    CheckSecurityService,
    SecurityService,
    CaService,
    TwdTransferService,
    F4000102ApiService,
    CheckService,
    A11yAlertService,
    A11yConfirmService,
    HandleErrorService

  ],
  declarations: [
    NoPredesignatedTransferPageComponent,
    NoPredesignatedConfirmPageComponent,
    NoPredesignatedResultPageComponent,
    NumbersOnlyDirective 
    ]
})
export class NoPredesignatedModule { }
