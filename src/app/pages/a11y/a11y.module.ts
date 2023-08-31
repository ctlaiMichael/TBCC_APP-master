import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { A11yRoutingModule } from './a11y-routing.module';
import { HomeMemuA11yPageComponent } from './home-memu-a11y-page/home-memu-a11y-page.component';
import { SharedModule } from '@shared/shared.module';
import { AccountSearchA11yPageComponent } from './account-search/account-search-a11y-page/account-search-a11y-page.component';
import { AccountSearchRoutingModule } from './account-search/account-search-routing.module';
import { AccountSearchModule } from './account-search/account-search.module';
import { LoginA11yPageComponent } from './login-a11y-page/login-a11y-page.component';
import { LoginService } from '@pages/login/shared/login.service';
import { BiometricService } from '@lib/plugins/biometric.service';
import { FtLoginService } from '@pages/login/shared/ftlogin.service';
import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { BI000100ApiService } from '@api/bi/bi000100/bi000100-api.service';
import { BI000101ApiService } from '@api/bi/bi000101/bi000101-api.service';
import { BI000102ApiService } from '@api/bi/bi000102/bi000102-api.service';
import { FG000501ApiService } from '@api/fg/fg000501/fg000501-api.service';
import { GuideA11yPageComponent } from './guide-a11y-page/guide-a11y-page.component';
import { PredesignatedTransferPageComponent } from './predesignated-a11y-page/predesignated-transfer-page/predesignated-transfer-page.component';
import { PredesignatedConfirmPageComponent } from './predesignated-a11y-page/predesignated-confirm-page/predesignated-confirm-page.component'
import { PredesignatedResultPageComponent } from './predesignated-a11y-page/predesignated-result-page/predesignated-result-page.component';
import { PredesignatedA11yPageModule } from './predesignated-a11y-page/predesignated-a11y-page.module';
import { FG000403ApiService } from '@api/fg/fg000403/fg000403-api.service';
import { FG000403ReqBody } from '@api/fg/fg000403/fg000403-req';
import { FG000404ApiService } from '@api/fg/fg000404/fg000404-api.service';
import { FG000404ReqBody } from '@api/fg/fg000404/fg000404-req';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000101ReqBody } from '@api/f4/f4000101/f4000101-req';

// ---------------- 台幣存款查詢 API Start ---------------- //
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service'; // 台幣存款
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service'; // 外幣存款
import { F2100101ApiService } from '@api/f2/f2100101/f2100101-api.service';
import { F2100102ApiService } from '@api/f2/f2100102/f2100102-api.service';
import { F2100105ApiService } from '@api/f2/f2100105/f2100105-api.service';
import { F2100103ApiService } from '@api/f2/f2100103/f2100103-api.service';
import { F2100104ApiService } from '@api/f2/f2100104/f2100104-api.service';
import { F2100106ApiService } from '@api/f2/f2100106/f2100106-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
//import { SplashScreenService } from '@lib/plugins/splash-screen.service';
import { AlertComponent } from '@shared/popup/a11y/alert/alert.component';
import { A11yAlertModule } from '@shared/popup/a11y/alert/alert.module';
import { A11yConfirmModule } from '@shared/popup/a11y/confirm/confirm.module';
import { SettingMenuA11yPageComponent } from './user-setting/setting-menu-a11y-page/setting-menu-a11y-page.component'
import { UserSettingModule } from './user-setting/user-setting.module';
import { F9000101ApiService } from '@api/f9/f9000101/f9000101-api.service';
import { F9000201ApiService } from '@api/f9/f9000201/f9000201-api.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { LoanA11yPageComponent } from './loan/loan-a11y-page/loan-a11y-page.component';
import { A11yResultPageComponent } from '@pages/a11y/resultPage/a11y-result-page.component';
import { LoanModule } from './loan/loan.module';
import { FinancialInfoMenuComponent } from './financial-information/financial-info-menu/financial-info-menu.component';
import { FinancialInformationModule } from './financial-information/financial-information.module';
import { NumbersOnlyDirective } from './predesignated-a11y-page/shared/numbers-only.directive';
import { CertificateService } from '@pages/security/shared/service/certificate.service';
import { FD000201ApiService } from '@api/fd/fd000201/fd000201-api.service';
import { FD000301ApiService } from '@api/fd/fd000301/fd000301-api.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { InputCertProtectPwdModule } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module'
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { CaService } from '@shared/transaction-security/ca-popup/ca.service';
import { OtpService } from '@shared/transaction-security/otp-popup/otp.service';
import { TwdTransferService } from '@pages/transfer/shared/service/twdTransfer.service';
import { F4000401ApiService } from '@api/f4/f4000401/f4000401-api.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { BI000103ApiService } from '@api/bi/bi000103/bi000103-api.service';
import { BI000104ApiService } from '@api/bi/bi000104/bi000104-api.service';
import { BI000105ApiService } from '@api/bi/bi000105/bi000105-api.service';
import { FC000303ApiService } from '@api/fc/fc000303/fc000303-api.service';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    // SplashScreenService,AccountSearchModule
    A11yRoutingModule,
    AccountSearchRoutingModule,
    AccountSearchModule,
    PredesignatedA11yPageModule,
    A11yAlertModule,
    A11yConfirmModule,
    UserSettingModule,
    FinancialInformationModule,
    //HomeModule
    LoanModule,
    CheckSecurityModule,
    InputCertProtectPwdModule,

  ],
  providers: [
    LoginService,
    BiometricService,
    CertService,
    CertificateService,
    FtLoginService,
    F1000101ApiService,
    BI000100ApiService,
    BI000101ApiService,
    FG000403ApiService,
    FG000403ReqBody,
    FG000404ApiService,
    FG000404ReqBody,
    F4000101ApiService,
    F4000101ReqBody,
    BI000102ApiService,
    FG000501ApiService,
    CertService,
    // ---------------- 存款查詢 Service ---------------- //
    F2000101ApiService,//台幣存款查詢
    F2000201ApiService,//外幣存款查詢
    // 台幣帳戶明細查詢
    F2100101ApiService,//活支存
    F2100102ApiService,//定存
    F2100105ApiService,//綜存
    // 台幣帳戶明細彙總
    F2100103ApiService,//活存
    F2100104ApiService,//支存
    F2100106ApiService,//綜存
    // 借款查詢
    F9000101ApiService,
    F9000201ApiService,

    // 登入
    FD000201ApiService,
    FD000301ApiService,
    InputCertProtectPwdService,

    // 約定轉帳
    CheckSecurityService,
    CaService,
    OtpService,
    TwdTransferService,
    F4000401ApiService,

    SecurityService,
    FH000203ApiService,
    BI000103ApiService,
    BI000104ApiService,
    FC000303ApiService,
    BI000105ApiService
  ],
  declarations: [
    HomeMemuA11yPageComponent,
    AccountSearchA11yPageComponent,
    LoanA11yPageComponent,
    SettingMenuA11yPageComponent,
    FinancialInfoMenuComponent,
    LoginA11yPageComponent,
    GuideA11yPageComponent,
    PredesignatedTransferPageComponent,
    NumbersOnlyDirective,
    A11yResultPageComponent
  ]
})
export class A11yModule { }
