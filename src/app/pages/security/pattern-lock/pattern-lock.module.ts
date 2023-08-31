import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatternLockRoutingModule } from './pattern-lock-routing.module';
import { PatternLockSettingPageComponent } from './pattern-lock-setting-page/pattern-lock-setting-page.component';
import { PrefacePageComponent } from './preface-page/preface-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '@shared/popup/alert/alert.module';
import { InputCertProtectPwdModule } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.module';
import { ConfirmModule } from '@shared/popup/confirm/confirm.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SharedModule } from '@shared/shared.module';
import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
import { LoginModule } from '@pages/login/login.module';
import { ResultPageComponent } from './result-page/result-page.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PatternLockRoutingModule,
    AlertModule,
    InputCertProtectPwdModule,
    ConfirmModule,
    MenuTempModule,
    CheckSecurityModule,
    SharedModule,
    LoginModule
  ],
  declarations: [
    PatternLockSettingPageComponent,
    PrefacePageComponent,
    ResultPageComponent
  ],
  providers: [
    PatternLockService
  ]
})
export class PatternLockModule { }
