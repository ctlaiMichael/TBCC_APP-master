/**
 * Route定義
 * 基金投資損益報告
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { RichProfitReportRoutingModule } from './rich-profit-report-routing.module';
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { FundFormateModule } from '@pages/fund/shared/pipe/fund-formate.module';

// ---------------- Pages Start ---------------- //
import { RichReportPageComponent } from './rich-report-tag/rich-report-page.component';
import { RichOverviewPageComponent } from './rich-overview/rich-overview-page.component';
import { RichDetailPageComponent } from './rich-detail/rich-detail-page.component';
import { RichDetailQueryPageComponent } from './rich-detail-query/rich-detail-query-page.component';
// ---------------- API Start ---------------- //
import { FI000303ApiService } from '@api/fi/fI000303/fI000303-api.service';
import { FI000304ApiService } from '@api/fi/fI000304/fI000304-api.service';
import { FI000305ApiService } from '@api/fi/fI000305/fI000305-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FlagFormateModule,
    RichProfitReportRoutingModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    FundFormateModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FI000303ApiService,
    FI000304ApiService,
    FI000305ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    RichReportPageComponent,
    RichOverviewPageComponent,
    RichDetailPageComponent,
    RichDetailQueryPageComponent
  ]
})
export class RichProfitReportModule { }
