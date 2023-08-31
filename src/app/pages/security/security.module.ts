import { CardSafePopUpModule } from '@shared/transaction-security/card-safe-popup/card-safe-popup.module';
import { NgModule } from '@angular/core';
import { DeviceService } from '@lib/plugins/device.service';
import { SharedModule } from '@shared/shared.module';
import { SecurityRoutingModule } from './security-routing.module';
import { FastloginAgreeComponent } from './fastlogin-agree/fastlogin-agree.component';
import { SecurityService } from './shared/service/security.service';
import { BiometricService } from '@lib/plugins/biometric.service';
import { BI000100ApiService } from '@api/bi/bi000100/bi000100-api.service';
import { BI000101ApiService } from '@api/bi/bi000101/bi000101-api.service';
import { FastloginSetComponent } from './fastlogin-set/fastlogin-set.component';
import { CertificateApplicationComponent } from './certificate/certificate-application/certificate-application.component';
import { CertificateServiceComponent } from './certificate/certificate-service/certificate-service.component';
import { CertificateChangepwdComponent } from './certificate/certificate-changepwd/certificate-changepwd.component';
import { CertificateChangeComponent } from './certificate/certificate-expire/certificate-change/certificate-change.component';
import { CertificateConfirmComponent } from './certificate/certificate-expire/certificate-confirm/certificate-confirm.component';
import { CertificateResultComponent } from './certificate/certificate-expire/certificate-result/certificate-result-page.component';
import { AlertModule } from '@shared/popup/alert/alert.module';
import { ConfirmModule } from '@shared/popup/confirm/confirm.module';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { FD000101ApiService } from '@api/fd/fd000101/fd000101-api.service';
import { FD000102ApiService } from '@api/fd/fd000102/fd000102-api.service';
import { FD000201ApiService } from '@api/fd/fd000201/fd000201-api.service';
import { FD000202ApiService } from '@api/fd/fd000202/fd000202-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { FD000203ApiService } from '@api/fd/fd000203/fd000203-api.service';
import { FD000301ApiService } from '@api/fd/fd000301/fd000301-api.service';
import { InputCertProtectPwdModule } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityMenuComponent } from './security-menu/security-menu.component';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module'
import { SystemInfoComponent } from './systemInfo/systemInfo.component';
import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { BI000103ApiService } from '@api/bi/bi000103/bi000103-api.service';
import { BI000104ApiService } from '@api/bi/bi000104/bi000104-api.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SecurityRoutingModule,
    AlertModule,
    InputCertProtectPwdModule,
    ConfirmModule,
    MenuTempModule,
    CheckSecurityModule,
    SharedModule,
    CardSafePopUpModule
  ],
  declarations: [
    FastloginAgreeComponent,
    FastloginSetComponent,
    CertificateApplicationComponent,
    CertificateServiceComponent,
    CertificateChangepwdComponent,
    CertificateChangeComponent,
    CertificateConfirmComponent,
    SecurityMenuComponent,
    CertificateResultComponent,
    SystemInfoComponent
  ],
  providers: [
    DeviceService,
    SecurityService,
    BI000100ApiService,
    BI000101ApiService,
    BiometricService,
    FD000101ApiService,
    FD000102ApiService,
    FD000201ApiService,
    FD000202ApiService,
    F4000101ApiService,
    FD000203ApiService,
    FH000203ApiService,
    FD000301ApiService,
    CertService,
    InputCertProtectPwdService,
    BI000103ApiService,
    BI000104ApiService
  ]
})
export class SecurityModule { }
