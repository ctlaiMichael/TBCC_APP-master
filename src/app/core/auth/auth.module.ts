import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { LoginRequired } from './login-required.service';
import { LogoutRequired } from './logout-required.service';
import { F1000102ApiService } from '@api/f1/f1000102/f1000102-api.service';
import { F1000109ApiService } from '@api/f1/f1000109/f1000109-api.service';
import { AutoLogoutModule } from '@shared/popup/auto-logout/auto-logout.module';
import { GoldacctRequired } from '@core/auth/goldacct-required.service';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { GoldactiveRequired } from './goldactive-required.service';
import { FB000703ApiService } from '@api/fb/fb000703/fb000703-api.service';
import { GoldBusinessHourRequied } from './gold-business-hour-requied.service';
import { FB000701ApiService } from '@api/fb/fb000701/fb000701-api.service';
import { A11yAutoLogoutModule } from '@shared/popup/a11y/auto-logout/auto-logout.module';
import { GoldbuyacctRequired } from './goldbuyacct-required.service';
import { GoldCompositeGuard } from './gold-composite.guard';
import { TakeNumberRequired } from '@core/auth/take-number-required.service';
import { FO000101ApiService } from '@api/fo/fo000101/fo000101-api.service';

@NgModule({
  imports: [
    CommonModule,
    AutoLogoutModule,
    // 新增a11y自動登出模組
    A11yAutoLogoutModule
  ],
  providers: [
    AuthService,
    LoginRequired,
    LogoutRequired,
    GoldacctRequired,
    GoldbuyacctRequired,
    GoldactiveRequired,
    GoldCompositeGuard,
    GoldBusinessHourRequied,
    TakeNumberRequired,
    F1000102ApiService,
    F1000109ApiService,
    FB000701ApiService,
    FB000705ApiService,
    FB000703ApiService,
    FO000101ApiService
  ]
})
export class AuthModule { }
