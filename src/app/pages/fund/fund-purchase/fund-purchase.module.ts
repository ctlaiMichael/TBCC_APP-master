/**
 * Route定義
 * 基金申購
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundPurchaseRoutingModule } from './fund-purchase-routing.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
import { FundSubjectComponentModule } from '../shared/component/fund-subject/fund-subject-component.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { DateSelectModule } from '@shared/popup/date-select-popup/date-select.module';
import { EnterAgreeContentComponentModule } from '@conf/terms/fund/enter-agree-content/enter-agree-content-component.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';
import { SelectBranchModule } from '@shared/select-branch/select-branch.module';
import { SearchStaffService } from '../shared/service/searchStaff.service';

// ---------------- Pages Start ---------------- //
import { PurchaseTagPageComponent } from './purchase-tag/purchase-tag-page.component';
import { PurchaseSinglePageComponent } from './purchase-single/purchase-single-page.component';
import { PurchaseRegularPageComponent } from './purchase-regular/purchase-regular-page.component';
import { PurchaseRegularNotPageComponent } from './purchase-regular-not/purchase-regular-not-page.component';
import { PurchaseSingleConfirmPageComponent } from './purchase-single-confirm/purchase-single-confirm-page.component';
import { PurchaseRegularConfirmPageComponent } from './purchase-regular-confirm/purchase-regular-confirm-page.component';
import { PurchaseSingleResultPageComponent } from './purchase-single-result/purchase-single-result-page.component';
import { PurchaseRegularResultPageComponent } from './purchase-regular-result/purchase-regular-result-page.component';
import { PurchaseRegularNotConfirmPageComponent } from './purchase-regular-not-confirm/purchase-regular-not-confirm-page.component';
import { PurchaseRegularNotResultPageComponent } from './purchase-regular-not-result/purchase-regular-not-result-page.component';
import { PurchaseResverSinglePageComponent } from './purchase-resver-single/purchase-resver-single-page.component';
import { PurchaseResverSingleConfirmPageComponent } from './purchase-resver-single-confirm/purchase-resver-single-confirm-page.component';
import { PurchaseResverSingleResultPageComponent } from './purchase-resver-single-result/purchase-resver-single-result-page.component';
import { InfomationModule } from '@shared/popup/infomation/infomation.module';
import { SinglePurchaseContentComponentModule } from '@conf/terms/fund/single-purchase-content/single-purchase-content.component.module';
import { RegularPurchaseContentComponentModule } from '@conf/terms/fund/regular-purchase-content/regular-purchase-content.component.module';
import { RegularPurchaseCodeComponentModule } from '@conf/terms/fund/regular-purchase-code/regular-purchase-code.component.module';
import { FundAmountContentComponentModule } from '@conf/terms/fund/fund-amount-content/fund-amount-content.component.module';
// ---------------- API Start ---------------- //
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service';
import { FI000402ApiService } from '@api/fi/fI000402/fI000402-api.service';
import { FI000403ApiService } from '@api/fi/fI000403/fI000403-api.service';
import { FI000404ApiService } from '@api/fi/fI000404/fI000404-api.service';
import { FI000405ApiService } from '@api/fi/fI000405/fI000405-api.service';
import { FI000406ApiService } from '@api/fi/fI000406/fI000406-api.service';
// import { FI000407ApiService } from '@api/fi/fI000407/fI000407-api.service';
// import { FI000408ApiService } from '@api/fi/fi000408/fI000408-api.service';
import { FI000709ApiService } from '@api/fi/fI000709/fI000709-api.service';
import { FI000710ApiService } from '@api/fi/fI000710/fI000710-api.service';
import { FI000713ApiService } from '@api/fi/fI000713/fI000713-api.service';
import { FundSelectBranchModule } from '@shared/fund-select-branch/fund-select-branch.module';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FundPurchaseRoutingModule,
    FlagFormateModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    BookmarkModule, // 頁籤
    DateRangeSearchComponentModule,
    FundSubjectComponentModule,
    DateSelectModule,
    SelectSecurityModule,
    CheckSecurityModule ,
    EnterAgreeContentComponentModule,
    InfomationModule,
    SinglePurchaseContentComponentModule,
    RegularPurchaseContentComponentModule,
    RegularPurchaseCodeComponentModule,
    FundAmountContentComponentModule,
    UserMaskModule,                    // 身分證隱碼
    FundSelectBranchModule  //基金自選分行
  ],
  providers: [
    // ---------------- Service Start ---------------- /
    FI000401ApiService,
    FI000402ApiService,
    FI000403ApiService,
    FI000404ApiService,
    FI000405ApiService,
    FI000406ApiService,
    // FI000407ApiService,
    // FI000408ApiService,
    FI000709ApiService,
    FI000710ApiService,
    FI000713ApiService,
    SearchStaffService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    PurchaseTagPageComponent,
    PurchaseSinglePageComponent,
    PurchaseRegularPageComponent,
    PurchaseRegularNotPageComponent,
    PurchaseSingleConfirmPageComponent,
    PurchaseRegularConfirmPageComponent,
    PurchaseSingleResultPageComponent,
    PurchaseRegularResultPageComponent,
    PurchaseRegularNotConfirmPageComponent,
    PurchaseRegularNotResultPageComponent,
    PurchaseResverSinglePageComponent,
    PurchaseResverSingleConfirmPageComponent,
    PurchaseResverSingleResultPageComponent
  ]
})
export class FundPurchaseModule { }
