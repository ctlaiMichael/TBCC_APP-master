import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginService } from './shared/login.service';
import { FtLoginService } from './shared/ftlogin.service';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { BiometricService } from '@lib/plugins/biometric.service';
import { AlertModule } from '@shared/popup/alert/alert.module';
import { ConfirmModule } from '@shared/popup/confirm/confirm.module';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { CertificateService } from '@pages/security/shared/service/certificate.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { InputCertProtectPwdModule } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

// 電文
import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { BI000100ApiService } from '@api/bi/bi000100/bi000100-api.service';
import { BI000101ApiService } from '@api/bi/bi000101/bi000101-api.service';
import { BI000102ApiService } from '@api/bi/bi000102/bi000102-api.service';
import { FG000501ApiService } from '@api/fg/fg000501/fg000501-api.service';
import { FD000201ApiService } from '@api/fd/fd000201/fd000201-api.service';
import { FD000301ApiService } from '@api/fd/fd000301/fd000301-api.service';
import { BI000103ApiService } from '@api/bi/bi000103/bi000103-api.service';
import { BI000104ApiService } from '@api/bi/bi000104/bi000104-api.service';
import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FC000303ApiService } from '@api/fc/fc000303/fc000303-api.service';
import { BI000105ApiService } from '@api/bi/bi000105/bi000105-api.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    CustomFormsModule,
    AlertModule,
    ConfirmModule,
    InputCertProtectPwdModule,
    CheckSecurityModule
  ],
  providers: [
    LoginService,
    BiometricService,
    FtLoginService,
    CertService,
    F1000101ApiService,
    FC000303ApiService,
    BI000100ApiService,
    BI000101ApiService,
    BI000102ApiService,
    BI000103ApiService,
    BI000104ApiService,
    BI000105ApiService,
    FG000501ApiService,
    CertificateService,
    FD000201ApiService,
    FD000301ApiService,
    InputCertProtectPwdService,
    PatternLockService,
    SecurityService,
    FH000203ApiService
  ],
  declarations: [LoginPageComponent]
})
export class LoginModule { }
