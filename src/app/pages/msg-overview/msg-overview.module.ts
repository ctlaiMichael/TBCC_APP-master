import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MsgOverviewRoutingModule } from './msg-overview-routing.module';
import { MsgOverviewSettingsPageComponent } from './msg-overview-settings-page/msg-overview-settings-page.component';
import { MsgOverviewHomePageComponent } from './msg-overview-home-page/msg-overview-home-page.component';
import { NewsBoardModule } from '@pages/news/news-board/news-board.module';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { MsgOverviewPageComponent } from './component/msg-overview-page/msg-overview-page.component';
import { MsgContentPageComponent } from './component/msg-content-page/msg-content-page.component';
import { MsgOverviewService } from './shared/service/msg-overview.service';
import { RateInformPageComponent } from './rate-inform-page/rate-inform-page.component';
import { EditRateInformPageComponent } from './edit-rate-inform-page/edit-rate-inform-page.component';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { P1000001ApiService } from '@api/p1/p1000001/p1000001-api.service';
import { RateInformOverviewPageComponent } from './rate-inform-overview-page/rate-inform-overview-page.component';
import { FundBalanceOverviewPageComponent } from './fund-balance-overview-page/fund-balance-overview-page.component';
import { OtpAlertTermPageComponent } from './otp-alert-term-page/otp-alert-term-page.component';
import { RateInformService } from './shared/service/rate-inform.service';
import { P1000002ApiService } from '@api/p1/p1000002/p1000002-api.service';
import { FB000201ApiService } from '@api/fb/fb000201/fb000201-api.service';

@NgModule({
  imports: [
    CommonModule,
    MsgOverviewRoutingModule,
    NewsBoardModule,
    SharedModule,
    PaginatorCtrlModule,
    BookmarkModule
  ],
  declarations: [
    MsgOverviewSettingsPageComponent,
    MsgOverviewHomePageComponent,
    MsgOverviewPageComponent,
    MsgContentPageComponent,
    RateInformPageComponent,
    EditRateInformPageComponent,
    RateInformOverviewPageComponent,
    FundBalanceOverviewPageComponent,
    OtpAlertTermPageComponent
  ],
  providers: [
    MsgOverviewService,
    RateInformService,
    P1000001ApiService,
    P1000002ApiService,
    FB000201ApiService, // 取得幣別
  ]
})
export class MsgOverviewModule { }
