import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectivePreloadingStrategy } from '@core/navgator/selective-preloading-strategy'; // pre load lazy loading
// ---------------- Service Start ---------------- //
import { LoginRequired } from '@core/auth/login-required.service';
import { LogoutRequired } from '@core/auth/logout-required.service';

import { TakeNumberRequired } from '@core/auth/take-number-required.service';
// ---------------- Pages Start ---------------- //
import { HomePageComponent } from '@pages/home/home-page/home-page.component';
// import { UserHomePageComponent } from '@pages/home/user-home-page/user-home-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 要處理的 Product APP 頁面
  // { path: 'lazy', loadChildren: '@pages/demo/lazyload.module#LazyloadModule' }, // 測試使用
  {
    // == 框架與系統相關其他功能 == //
    path: 'layout', loadChildren: '@pages/layout/layout.module#LayoutModule'
    , data: {
      preload: true
    }
    // ,canActivate: [LogoutRequired]
  },
  // 首頁
  {
    path: 'home', loadChildren: '@pages/home/home.module#HomeModule'
    , data: {
      preload: true
    }
  },
  {
    path: 'edit', loadChildren: '@pages/edit/edit.module#EditModule'
    , data: {
      preload: false
    }
  },
  {
    path: 'login', loadChildren: '@pages/login/login.module#LoginModule'
    , data: {
      preload: true
    }
    // ,canActivate: [LogoutRequired]
  },
  // ======================================== 共用功能 ======================================== //

  {
    // == 訊息頁 == //
    path: 'result', loadChildren: '@pages/result/result.module#ResultModule'
    , data: {
      preload: false
    }
  },
  {
    // == 掃碼？ == //
    path: 'scan', loadChildren: '@pages/scan/scan.module#ScanModule'
    , data: {
      preload: false
    }
  },
  {
    // == ？ == //
    path: 'micro-interaction', loadChildren: '@shared/popup/micro-interaction/micro-interaction.module#microInteractionModule'
    , data: {
      preload: false
    }
  },


  // ======================================== 業務功能 ======================================== //
  {
    // == 存款查詢 == //
    path: 'deposit', loadChildren: '@pages/deposit/deposit.module#DepositModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 外匯業務 == //
    path: 'foreign-exchange', loadChildren: '@pages/foreign-exchange/foreign-exchange.module#ForeignExchangeModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 授信業務 == //
    path: 'credit', loadChildren: '@pages/credit/credit.module#CreditModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 基金業務 == //
    path: 'fund', loadChildren: '@pages/fund/fund.module#FundModule'
    , data: {
      preload: true
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 黃金存摺 == //
    path: 'gold-business', loadChildren: '@pages/gold-business/gold-business.module#GoldBusinessModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 轉帳業務 == //
    path: 'transfer', loadChildren: '@pages/transfer/transfer.module#TransferModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 繳稅費 == //
    path: 'taxes-fees', loadChildren: '@pages/taxes/taxes-fees.module#TaxesFeesModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired] // 讓使用者可以看到選單
  },
  {
    // == 安控管理 == //
    path: 'security', loadChildren: '@pages/security/security.module#SecurityModule'
    , data: {
      preload: true
    }
    // , canActivate: [LoginRequired] // 讓使用者可以看到選單
  },
  {
    // == 訊息總覽 == //
    path: 'msg-overview', loadChildren: '@pages/msg-overview/msg-overview.module#MsgOverviewModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired] // 讓使用者可以看到選單
  },
  {
    // == 其他服務(使用者資訊設定) == //
    path: 'user-set', loadChildren: '@pages/user-set/user-set.module#UserSetModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired] // 讓使用者可以看到選單
  },

  // ======================================== 其他功能 ======================================== //
  {
    // == 金融資訊 == //
    path: 'financial', loadChildren: '@pages/financial/financial.module#FinancialModule'
    , data: {
      preload: true // 首頁效果要漂亮先載入為佳
    }
  },
  {
    // == 最新消息 == //
    path: 'news', loadChildren: '@pages/news/news.module#NewsModule'
    , data: {
      preload: false
    }
  },
  {
    // == 服務據點 == //
    path: 'location', loadChildren: '@pages/location/location.module#LocationModule'
    , data: {
      preload: false
    }
  },
  {
    // == 線上取號 == //
    path: 'take-number', loadChildren: '@pages/take-number/take-number.module#TakeNumberModule'
    , data: {
      preload: false
    }
    // , canActivate: [TakeNumberRequired]
  },
  {
    // == 其他外連專區 == //
    path: 'other-service', loadChildren: '@pages/other-service/other-service.module#OtherServiceModule'
    , data: {
      preload: false
    }
  },


  // ======================================== 特殊專區 ======================================== //
  {
    // == 醫療服務&產壽險服務 == //
    path: 'hospital', loadChildren: '@pages/hospital/hospital.module#HospitalModule'
    , data: {
      preload: false
    }
  },
  {
    // == 信用卡 == //
    path: 'card', loadChildren: '@pages/card/card.module#CardModule'
    , data: {
      preload: false
    }
  },
  {
    // == 合庫epay == //
    path: 'epay', loadChildren: '@pages/epay/epay.module#EpayModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
{
    // == 信用卡epay == //
    path: 'epay-card', loadChildren: '@pages/epay-card/epay-card.module#EpayCardModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 線上櫃台 == //
    path: 'front-desk', loadChildren: '@pages/front-desk/front-desk.module#FrontDeskModule'
    , data: {
      preload: false
    }
  },
   // ======================================== 無障礙 ======================================== //
   {
    // == 無障礙登入後首頁 == //
    path: 'a11y', loadChildren: '@pages/a11y/a11y.module#A11yModule'
    , data: {
      preload: false
    }
  },
  {
    // == 無卡提款 == //
    path: 'nocard', loadChildren: '@pages/nocard/nocard.module#NocardModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    // == 線上申貸 == //
    path: 'online-loan', loadChildren: '@pages/online-loan/online-loan.module#OnlineLoanModule'
    , data: {
      preload: false
    }
  },
  {
    path: '**', // any other
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
    , preloadingStrategy: SelectivePreloadingStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
