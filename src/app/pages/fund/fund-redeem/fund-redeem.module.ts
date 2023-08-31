/**
 * Route定義
 * 基金贖回
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundRedeemRoutingModule } from './fund-redeem-routing.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { DateSelectModule } from '@shared/popup/date-select-popup/date-select.module';
import { RedeemRestrictComponentModule } from '@conf/terms/fund/redeem-restrict/redeem-restrict.component.module';
import { EnterAgreeContentComponentModule } from '@conf/terms/fund/enter-agree-content/enter-agree-content-component.module';
// ---------------- Pages Start ---------------- //
import { RedeemMainComponent } from './redeem-main/redeem-main-page.component';
import { RedeemEdit1PageComponent } from './redeem-edit1/redeem-edit1-page.component';
import { RedeemEdit2PageComponent } from './redeem-edit2/redeem-edit2-page.component';
import { RedeemConfirmPageComponent } from './redeem-confirm/redeem-confirm-page.component';
import { RedeemResultPageComponent } from './redeem-result/redeem-result-page.component';
// ---------------- API Start ---------------- //
import { FI000501ApiService } from '@api/fi/fI000501/fI000501-api.service';
import { FI000502ApiService } from '@api/fi/fI000502/fI000502-api.service';
import { FI000503ApiService } from '@api/fi/fI000503/fI000503-api.service';
import { FI000504ApiService } from '@api/fi/fI000504/fI000504-api.service';
import { FI000505ApiService } from '@api/fi/fI000505/fI000505-api.service';
import { FI000506ApiService } from '@api/fi/fI000506/fI000506-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FundRedeemRoutingModule,
    FlagFormateModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    BookmarkModule, // 頁籤
    DateRangeSearchComponentModule,
    DateSelectModule,
    SelectSecurityModule,
    CheckSecurityModule,
    EnterAgreeContentComponentModule,
    RedeemRestrictComponentModule
  ],
  providers: [
    // ---------------- Service Start ---------------- /
    FI000501ApiService,
    FI000502ApiService,
    FI000503ApiService,
    FI000504ApiService,
    FI000505ApiService,
    FI000506ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    RedeemMainComponent,
    RedeemEdit1PageComponent,
    RedeemEdit2PageComponent,
    RedeemConfirmPageComponent,
    RedeemResultPageComponent
  ]
})
export class FundRedeemModule { }
