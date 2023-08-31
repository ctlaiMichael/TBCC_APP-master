import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAssetOverviewRoutingModule } from './user-asset-overview-routing.module';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { FB000201ApiService } from '@api/fb/fb000201/fb000201-api.service';
import { SharedModule } from '@shared/shared.module';

// ---------------- Model Start ---------------- //

import { DepositInquiryServiceModule } from '@pages/deposit/shared/deposit-inquiry-service.module'; // 首頁資料處理
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
import { UserAssetOverviewComponent } from './user-asset-overview.component';

// 首頁資料處理
// import { HomeGoldComponentModule } from '@pages/home/shared/component/home-gold/home-gold-component.module';
// import { HomeForexRateComponentModule } from '@pages/home/shared/component/home-forex-rate/home-forex-rate-component.module';
// import { HomeCardComponentModule } from '@pages/home/shared/component/home-card/home-card-component.module';


@NgModule({
  imports: [
    SharedModule,
    UserAssetOverviewRoutingModule
    // == 首頁資料處理 == //
    , DepositInquiryServiceModule // 存款查詢lib
    // , HomeGoldComponentModule // 黃金BOX
    // , HomeForexRateComponentModule // 外匯匯率
    // , HomeCardComponentModule // 信用卡
  ]
  ,
  providers: [
      // ---------------- Service Start ---------------- //
      ExchangeService,
      FB000201ApiService
  ],
  declarations: [
    UserAssetOverviewComponent
  ],
  entryComponents: [
  ],
  exports: [
      // 主要page放出來即可
  ]

})
export class UserAssetOverviewModule { }
