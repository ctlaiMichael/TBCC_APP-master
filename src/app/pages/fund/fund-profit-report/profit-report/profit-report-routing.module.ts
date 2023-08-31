import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundReportPageComponent } from './fund-report-tag/fund-report-page.component';
import { StockOverviewPageComponent } from './stock-overview/stock-overview-page.component';
import { StockOverviewMorePageComponent } from './stock-overview-more/stock-overview-more-page.component';
import { StockDetailPageComponent } from './stock-detail/stock-detail-page.component';
import { FundDetailTagPagaComponent } from './fund-detail-tag/fund-detail-tag-page.component';
import { FundDetailLossPageComponent } from './fund-detail-loss/fund-detail-loss-page.component';
import { FundDetailTransactionComponent } from './fund-detail-transaction/fund-detail-transaction-page.component';
import { FundDetailTransactionMoreComponent } from './fund-detail-transaction-more/fund-detail-transaction-more-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  {
    // == 基金投資損益報告(主控tag) == //
    path: 'fund-report', component: FundReportPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 基金庫存總覽 == //
    path: 'stock-overview', component: StockOverviewPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 基金庫存總覽(詳細資料) == //
    path: 'stock-overview-more', component: StockOverviewMorePageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 基金庫存明細 == //
    path: 'stock-detail', component: StockDetailPageComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 基金交易明細查詢(主控tag，第二層) == //
    path: 'fund-detail-tag', component: FundDetailTagPagaComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 基金損益(第二層) == //
    path: 'fund-detail-loss', component: FundDetailLossPageComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 基金交易明細(第二層) == //
    path: 'fund-detail-transaction', component: FundDetailTransactionComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 基金交易明細，該筆詳細資料(第三層) == //
    path: 'fund-detail-transaction-more', component: FundDetailTransactionMoreComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfitReportRoutingModule { }
