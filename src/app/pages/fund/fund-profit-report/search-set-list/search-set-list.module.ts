/**
 * Route定義
 * 觀察組合
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { NumberFormateModule } from '@shared/formate/number/number-formate.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { FundFormateModule } from '@pages/fund/shared/pipe/fund-formate.module';
import { SearchSetListRoutingModule } from './search-set-list-routing.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { ExpandListModule } from '@shared/template/list/expand/expand-list.module';

// ---------------- Pages Start ---------------- //
import { SearchSetListPageComponent } from './search-set-list-page.component';
import { SearchSetDetailComponent } from './search-set-detail.component';

// ---------------- API Start ---------------- //
import { FI000801ApiService } from '@api/fi/fI000801/fi000801-api.service';
import { FundPurchaseModule } from '@pages/fund/fund-purchase/fund-purchase.module';
import { EnterAgreeContentComponentModule } from '@conf/terms/fund/enter-agree-content/enter-agree-content-component.module';
import { FI000802ApiService } from '@api/fi/fi000802/fi000802-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FlagFormateModule,
    SearchSetListRoutingModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    ExpandListModule,  // 展開列表
    FundFormateModule,
    BookmarkModule,
    FundPurchaseModule,
    EnterAgreeContentComponentModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FI000801ApiService,
    FI000802ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    SearchSetListPageComponent,
    SearchSetDetailComponent
  ]
})
export class SearchSetListModule { }
