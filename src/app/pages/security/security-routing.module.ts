import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FastloginAgreeComponent } from './fastlogin-agree/fastlogin-agree.component';
import { FastloginSetComponent } from './fastlogin-set/fastlogin-set.component';
import { CertificateApplicationComponent } from './certificate/certificate-application/certificate-application.component';
import { CertificateServiceComponent } from './certificate/certificate-service/certificate-service.component';
import { CertificateChangepwdComponent } from './certificate/certificate-changepwd/certificate-changepwd.component';
// certificate-expire
import { CertificateChangeComponent } from './certificate/certificate-expire/certificate-change/certificate-change.component';
import { CertificateConfirmComponent } from './certificate/certificate-expire/certificate-confirm/certificate-confirm.component';
import { CertificateResultComponent } from './certificate/certificate-expire/certificate-result/certificate-result-page.component';
import { LoginRequired } from '@core/auth/login-required.service';
import { SecurityMenuComponent } from './security-menu/security-menu.component';
import { SystemInfoComponent } from './systemInfo/systemInfo.component';

const routes: Routes = [
  {
    // == 安控管理選單 == //
    path: '', redirectTo: 'menu', pathMatch: 'full'
  }
  , {
    path: 'menu', component: SecurityMenuComponent, data: {
    }
  },
  {
    path: 'agree', // 快速登入同意事項
    component: FastloginAgreeComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'ftloginset', // 快速登入設定
    component: FastloginSetComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'certificateApplication', // 憑證下載頁
    component: CertificateApplicationComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'certificateService', // 憑證資訊
    component: CertificateServiceComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'certificateChangepwd', // 憑證密碼更新
    component: CertificateChangepwdComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'certificateChange', // 憑證到期繳費
    component: CertificateChangeComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'certificateConfirm', // 憑證更新確認
    component: CertificateConfirmComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }, {
    path: 'certificateResult', // 憑證更新確認
    component: CertificateResultComponent
    , canActivate: [LoginRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  },
   // 系統資訊
  {
    path: 'systemInfo',
    component: SystemInfoComponent
    // , canActivate: [LoginRequired] // 免登入
  },
  // OTP服務
  {
    path: 'otp-service', loadChildren: './otp-service/otp-service.module#OtpServiceModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  // 圖形鎖
  {
    path: 'pattern-lock', loadChildren: './pattern-lock/pattern-lock.module#PatternLockModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  // 裝置綁定
  {
    path: 'device-bind', loadChildren: './device-bind/device-bind.module#DeviceBindModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
