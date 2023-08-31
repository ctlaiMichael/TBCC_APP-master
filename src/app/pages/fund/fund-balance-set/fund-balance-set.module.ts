/**
 * Route定義
 * 基金贖回
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundBalanceSetRoutingModule } from './fund-balance-set-routing.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { DateSelectModule } from '@shared/popup/date-select-popup/date-select.module';
import { EnterBalanceComponentModule } from '@conf/terms/fund/enter-balance/enter-balance.component.module';
// ---------------- Pages Start ---------------- //
import { FundBalanceSetComponent } from './fund-balance-set.component';
import { FundBalanceSetResultComponent } from './fund-balance-set-result.component';
// ---------------- API Start ---------------- //
import { FI000705ApiService } from '@api/fi/fi000705/fI000705-api.service';
import { FI000706ApiService } from '@api/fi/fI000706/fI000706-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FundBalanceSetRoutingModule,
    FlagFormateModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    BookmarkModule, // 頁籤
    DateRangeSearchComponentModule,
    DateSelectModule,
    SelectSecurityModule,
    CheckSecurityModule,
    EnterBalanceComponentModule
  ],
  providers: [
    // ---------------- Service Start ---------------- /
    FI000705ApiService,
    FI000706ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    FundBalanceSetComponent,
    FundBalanceSetResultComponent
  ]
})
export class FundBalanceSetModule { }
