import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundMenuComponent } from '@pages/fund/fund-menu/fund-menu-page.component';
import { FundRequired } from '@pages/fund/shared/policy/fund-required.service';

// ---------------- Pages Start ---------------- //

const routes: Routes = [
  {
    path: 'menu', component: FundMenuComponent
    , data: {
      checkPolicy: true
    }
    , canActivate: [FundRequired]
  }
  ,
  {
    path: 'fund-other', loadChildren: './fund-other/fund-other.module#FundOtherModule'
    , canActivate: [FundRequired]
  }
  // ======================================== report ======================================== //
  // == 基金投資損益報告 == //
  , {
    path: 'profit-report', loadChildren: './fund-profit-report/profit-report/profit-report.module#ProfitReportModule'
    , canActivate: [FundRequired]
  }
  // 智富投資損益報告
  , {
    path: 'rich-profit-report', loadChildren: './fund-profit-report/rich-profit-report/rich-profit-report.module#RichProfitReportModule'
    , canActivate: [FundRequired]
  }
  // 已實現損益查詢
  , {
    path: 'has-realize', loadChildren: './fund-profit-report/has-realize-query/has-realize-query.module#HasRealizeQueryModule'
    , canActivate: [FundRequired]
  }
   // 觀察組合
   , {
    path: 'search-set-list', loadChildren: './fund-profit-report/search-set-list/search-set-list.module#SearchSetListModule'
    , canActivate: [FundRequired]
  }
     // 投資設定
   , {
      path: 'search-set', loadChildren: './fund-profit-report/search-set/search-set.module#SearchSetModule'
      , canActivate: [FundRequired]
    }
  // ======================================== payment ======================================== //
  // 基金申購
  , {
    path: 'fund-purchase', loadChildren: './fund-purchase/fund-purchase.module#FundPurchaseModule'
    , data: {
      checkPolicy: true
    }
    , canActivate: [FundRequired]
  }
  // 基金贖回
  , {
    path: 'fund-redeem', loadChildren: './fund-redeem/fund-redeem.module#FundRedeemModule'
    , canActivate: [FundRequired]
  }
  // 基金轉換
  , {
    path: 'fund-convert', loadChildren: './fund-convert/fund-convert.module#FundConvertModule'
    , data: {
      checkPolicy: true
    }
    , canActivate: [FundRequired]
  }
  // 定期不定額查詢異動
  , {
    path: 'pay-change', loadChildren: './fund-pay-change/fund-pay-change.module#FundPayChangeModule'
    , canActivate: [FundRequired]
  }
  // 現金收益存入帳號異動
  , {
    path: 'deposit-account', loadChildren: './fund-deposit-account/fund-deposit-account.module#FundDepositAccountModule'
    , data: {
      checkPolicy: true
    }
    , canActivate: [FundRequired]
  }
  // 查詢預約取消基金
  , {
    path: 'reserve-cancel', loadChildren: './fund-reserve-cancel/fund-reserve-cancel.module#FundReserveCancelModule'
    , canActivate: [FundRequired]
  }
  // ======================================== other ======================================== //
  // 停損獲利點通知
  , {
    path: 'income-notify', loadChildren: './fund-income-notify/income-notify.module#IncomeNotifyModule'
    , canActivate: [FundRequired]
  }
  // 基金停損點設定
  , {
    path: 'fund-balance-set', loadChildren: './fund-balance-set/fund-balance-set.module#FundBalanceSetModule'
    , data: {
      checkPolicy: true
    }
    , canActivate: [FundRequired]
  }
  // 信託對帳單寄送方式
  , {
    path: 'fund-statement', loadChildren: './fund-statement/fund-statement.module#FundStatementModule'
    , data: {
      checkPolicy: true
    }
    , canActivate: [FundRequired]
  }
  // 信託業務推介
  , {
    path: 'fund-recommendation', loadChildren: './fund-recommendation/fund-recommendation.module#FundRecommendationModule'
    , canActivate: [FundRequired]
  }
  // 申請網路理財
  , {
    path: 'fund-network', loadChildren: './fund-network/fund-network.module#FundNetworkModule'
    , canActivate: [FundRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundRoutingModule { }
