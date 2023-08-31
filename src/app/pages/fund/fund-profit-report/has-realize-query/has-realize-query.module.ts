/**
 * Route定義
 * 基金投資損益報告
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { HasRealizeQueryRoutingModule } from './has-realize-query-routing.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
import { FundFormateModule } from '@pages/fund/shared/pipe/fund-formate.module';
// ---------------- Pages Start ---------------- //
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { HasRealizeTagPageComponent } from './has-realize-tag/has-realize-tag-page.component';
import { HasRealizeTypePageComponent } from './has-realize-type/has-realize-type-page.component';
import { HasRealizeDetailPageComponent } from './has-realize-detail/has-realize-detail-page.component';
import { HasRealizeOverviewPageComponent } from './has-realize-overview/has-realize-overview-page.component';
import { HasRealizeDetailQueryPageComponent } from './has-realize-detail-query/has-realize-detail-query-page.component';

// ---------------- API Start ---------------- //
import { FI000201ApiService } from '@api/fi/fI000201/fI000201-api.service';
import { FI000202ApiService } from '@api/fi/fI000202/fI000202-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    HasRealizeQueryRoutingModule,
    FlagFormateModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    BookmarkModule, // 頁籤
    DateRangeSearchComponentModule
    , FundFormateModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FI000201ApiService,
    FI000202ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    HasRealizeTagPageComponent
    ,HasRealizeTypePageComponent
    ,HasRealizeDetailPageComponent
    ,HasRealizeOverviewPageComponent
    ,HasRealizeDetailQueryPageComponent
  ]
})
export class HasRealizeQueryModule { }
