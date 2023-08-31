import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingRoutingModule } from './user-setting-routing.module';
import { ChangeNameA11yPageComponent } from './change-name-a11y-page/change-name-a11y-page.component';
import { ChangePwdA11yPageComponent } from './change-pwd-a11y-page/change-pwd-a11y-page.component';
import { ChangeSslPwdA11yPageComponent } from './change-ssl-pwd-a11y-page/change-ssl-pwd-a11y-page.component';
import { UserSettingResultA11yPageComponent } from './user-setting-result-a11y-page/user-setting-result-a11y-page.component';
import { securityManageService } from '@pages/user-set/shared/service/security-manage.service';
import { FG000101ApiService } from '@api/fg/fg000101/fg000101-api.service';
import { FG000201ApiService } from '@api/fg/fg000201/fg000201-api.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { sslChgService } from '@pages/user-set/shared/service/sslChg.service';
import { FG000601ApiService } from '@api/fg/fg000601/fg000601-api.service';


// 裝置綁定start
import { StepBarModule } from '@shared/template/stepbar/step-bar.module'; // 步驟列
import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module'; // 網銀登入密碼
import { DeviceBindA11yPageComponent } from './device-bind-a11y-page/device-bind-a11y-page.component';
import { DeviceBindSendA11yPageComponent } from './device-bind-a11y-page/device-bind-send-a11y/device-bind-send-a11y-page.component';
// ---------------- API Start ---------------- //
import { F1000106ApiService } from '@api/f1/f1000106/f1000106-api.service';
import { F1000107ApiService } from '@api/f1/f1000107/f1000107-api.service';
// ---------------- Service Start ---------------- //
import { DeviceBindService } from '@pages/security/shared/service/device-bind.service';
import { ResultTempModule } from '@shared/template/result/result-temp.module'; // 結果頁
// ---------------- Shared Start ---------------- //
// 裝置綁定end 

@NgModule({
  imports: [
    CommonModule,
    UserSettingRoutingModule,
    FormsModule,
    TranslateModule,
    StepBarModule,
    LoginPswdComponentModule,
    ResultTempModule
  ],
  providers: [
    securityManageService,
    sslChgService,
    FG000101ApiService,
    FG000201ApiService,
    FG000601ApiService,
    F1000106ApiService,
    F1000107ApiService,
    DeviceBindService
  ],
  declarations: [
     ChangeNameA11yPageComponent,
     ChangePwdA11yPageComponent,
     ChangeSslPwdA11yPageComponent,
     UserSettingResultA11yPageComponent,
     DeviceBindA11yPageComponent,
     DeviceBindSendA11yPageComponent
    ]
})
export class UserSettingModule { }
