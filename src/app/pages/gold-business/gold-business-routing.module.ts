import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoldMenuPageComponent } from './gold-menu/gold-menu-page.component';
import { GoldCompositeGuard } from '@core/auth/gold-composite.guard';

// ==Service: 欲使用的service== //
// 啟動狀態查詢電文

// 統一使用 GoldCompositeGuard 加上 data: { guards: [ guardName: string ]}
// 黃金 guard 顯示訊息優先順序
// GoldBusinessHourRequied > GoldacctRequired > GoldactiveRequired > GoldbuyacctRequired

// == Route 設定 == //
const routes: Routes = [
  { path: 'menu', component: GoldMenuPageComponent, data: {} },
  { // 黃金交易明細查詢
    path: 'gold-detail', loadChildren: './detail/gold-detail.module#GoldDetailModule',
    // canActivate: [GoldacctRequired],
    data: {
      guards: ['GoldacctRequired']
    },
    canActivate: [GoldCompositeGuard]
  },
  { // 黃金存摺申請啟用
    path: 'activation', loadChildren: './activation/activation.module#GoldBusinessActiveModule',
    // canActivate: [GoldacctRequired]
    data: {
      guards: ['GoldacctRequired']
    },
    canActivate: [GoldCompositeGuard]
  },
  { // 黃金回售
    path: 'gold-sell', loadChildren: './gold-sell/gold-sell.module#GoldSellModule',
    // canActivate: [GoldacctRequired, GoldactiveRequired, GoldBusinessHourRequied]
    data: {
      guards: ['GoldBusinessHourRequied', 'GoldacctRequired', 'GoldactiveRequired']
    },
    canActivate: [GoldCompositeGuard]
  },
  { // 黃金買進
    path: 'gold-buy', loadChildren: './gold-buy/goldbuy-module#GoldbuyModule',
    // canActivate: [GoldacctRequired, GoldbuyacctRequired, GoldactiveRequired, GoldBusinessHourRequied]
    data: {
      guards: ['GoldBusinessHourRequied', 'GoldacctRequired', 'GoldactiveRequired', 'GoldbuyacctRequired']
    },
    canActivate: [GoldCompositeGuard]
  }
  , { // 黃金定期定額
    path: 'goldterms', loadChildren: './goldterms/goldterms.module#GoldtermsModule',
    // canActivate: [GoldacctRequired, GoldbuyacctRequired, GoldactiveRequired, GoldBusinessHourRequied]
    data: {
      guards:
        ['GoldBusinessHourRequied', 'GoldacctRequired', 'GoldactiveRequired', 'GoldbuyacctRequired']
    },
    canActivate: [GoldCompositeGuard]
  }


  // {path: 'transaction-detail',
  //     loadChildren: '../transaction-detail/transaction-detail.module#GoldDetailClass'
  //     , data: {
  //         preload: false,
  //         headerTitle: 'MenuDemo'
  //     }

];






@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldRoutingModule { }
