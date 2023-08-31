import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomePageRoutingModule } from './user-home-page-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Model Start ---------------- //
import { DepositInquiryServiceModule } from '@pages/deposit/shared/deposit-inquiry-service.module'; // 首頁資料處理
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
import { UserHomePageComponent } from './user-home-page.component';

// 首頁資料處理
import { HomeGoldComponentModule } from '@pages/home/shared/component/home-gold/home-gold-component.module';
import { HomeForexRateComponentModule } from '@pages/home/shared/component/home-forex-rate/home-forex-rate-component.module';
import { HomeCardComponentModule } from '@pages/home/shared/component/home-card/home-card-component.module';


@NgModule({
  imports: [
    SharedModule,
    UserHomePageRoutingModule
    // == 首頁資料處理 == //
    , DepositInquiryServiceModule // 存款查詢lib
    , HomeGoldComponentModule // 黃金BOX
    , HomeForexRateComponentModule // 外匯匯率
    , HomeCardComponentModule // 信用卡
  ]
  ,
  providers: [
      // ---------------- Service Start ---------------- //
  ],
  declarations: [
    UserHomePageComponent
  ],
  entryComponents: [
  ],
  exports: [
      // 主要page放出來即可
  ]

})
export class UserHomePageModule { }
