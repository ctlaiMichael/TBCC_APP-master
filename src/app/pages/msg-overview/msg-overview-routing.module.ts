import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsgOverviewHomePageComponent } from './msg-overview-home-page/msg-overview-home-page.component';
import { MsgOverviewSettingsPageComponent } from './msg-overview-settings-page/msg-overview-settings-page.component';
import { RateInformPageComponent } from './rate-inform-page/rate-inform-page.component';
import { EditRateInformPageComponent } from './edit-rate-inform-page/edit-rate-inform-page.component';
import { LoginRequired } from '@core/auth/login-required.service';
import { RateInformOverviewPageComponent } from './rate-inform-overview-page/rate-inform-overview-page.component';
import { FundBalanceOverviewPageComponent } from './fund-balance-overview-page/fund-balance-overview-page.component';
import { OtpAlertTermPageComponent } from './otp-alert-term-page/otp-alert-term-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    // == 訊息總覽 == //
    path: 'home', component: MsgOverviewHomePageComponent
  },
  {
    // == 通知設定 == //
    path: 'settings', component: MsgOverviewSettingsPageComponent, canActivate: [LoginRequired]
  },
  {
    // == OTP密碼通知條款 == //
    path: 'otp-alert-term', component: OtpAlertTermPageComponent, canActivate: [LoginRequired]
  },
  {
    // == 匯率到價通知 == //
    path: 'rate-inform', component: RateInformPageComponent, canActivate: [LoginRequired]
  },
  {
    // == 匯率到價通知 == //
    path: 'rate-inform-overview', component: RateInformOverviewPageComponent, canActivate: [LoginRequired]
  },
  {
    // == 匯率到價通知 == //
    path: 'fund-balance-overview', component: FundBalanceOverviewPageComponent, canActivate: [LoginRequired]
  },
  {
    // == 編輯匯率到價通知 == //
    path: 'edit-rate-inform', component: EditRateInformPageComponent, canActivate: [LoginRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsgOverviewRoutingModule { }
