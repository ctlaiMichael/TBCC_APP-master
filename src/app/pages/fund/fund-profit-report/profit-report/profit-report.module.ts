/**
 * Route定義
 * 基金投資損益報告
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProfitReportRoutingModule } from './profit-report-routing.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
import { FundFormateModule } from '@pages/fund/shared/pipe/fund-formate.module';

// ---------------- Pages Start ---------------- //
import { FundReportPageComponent } from './fund-report-tag/fund-report-page.component';
import { StockOverviewPageComponent } from './stock-overview/stock-overview-page.component';
import { StockOverviewMorePageComponent } from './stock-overview-more/stock-overview-more-page.component';
import { StockDetailPageComponent } from './stock-detail/stock-detail-page.component';
import { FundDetailTagPagaComponent } from './fund-detail-tag/fund-detail-tag-page.component';
import { FundDetailLossPageComponent } from './fund-detail-loss/fund-detail-loss-page.component';
import { FundDetailTransactionComponent } from './fund-detail-transaction/fund-detail-transaction-page.component';
import { FundDetailTransactionMoreComponent } from './fund-detail-transaction-more/fund-detail-transaction-more-page.component';

// ---------------- API Start ---------------- //
import { FI000101ApiService } from '@api/fi/fI000101/fI000101-api.service';
import { FI000102ApiService } from '@api/fi/fI000102/fI000102-api.service';
import { FI000103ApiService } from '@api/fi/fI000103/fI000103-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FlagFormateModule,
    NumberFormateModule,
    ProfitReportRoutingModule,
    PaginatorCtrlModule,
    BookmarkModule, // 頁籤
    DateRangeSearchComponentModule,
    FundFormateModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FI000101ApiService
    ,FI000102ApiService
    ,FI000103ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    FundReportPageComponent
    ,StockOverviewPageComponent
    ,StockOverviewMorePageComponent
    ,StockDetailPageComponent
    ,FundDetailTagPagaComponent
    ,FundDetailLossPageComponent
    ,FundDetailTransactionComponent
    ,FundDetailTransactionMoreComponent
  ]
})
export class ProfitReportModule { }
