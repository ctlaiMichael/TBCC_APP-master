/**
 * Route定義
 * 存款查詢
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { DepositMenuComponent } from './deposit-menu/deposit-menu-page.component';
// ---------------- Shared Start ---------------- //

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  // == 存款查詢選單 == //
  , {
    path: 'menu', component: DepositMenuComponent
  }
  // ==帳戶總攬== //
  , {
    path: 'user-asset', loadChildren: './user-asset-overview/user-asset-overview.module#UserAssetOverviewModule'
    , data: {
      preload: false
    }
  }
  // == 存款總覽 == //
  , {
    path: 'overview', loadChildren: './overview/deposit-overview.module#DepositOverviewModule'
    , data: {
      preload: false
    }
  }
  // == 存款不足額票據 == //
  , {
    path: 'insufficient-bill', loadChildren: './insufficient-bill/insufficient-bill.module#InsufficientBillModule'
    , data: {
      preload: false
    }
  }
  // == 當日匯款 == //
  , {
    path: 'day-remittance', loadChildren: './day-remittance/day-remittance.module#DayRemittanceModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositRoutingModule {
  constructor(
  ) {
  }
}
