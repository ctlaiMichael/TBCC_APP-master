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
import { SearchSetRoutingModule } from './search-set-routing.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
import { ExpandListModule } from '@shared/template/list/expand/expand-list.module';
import { FundSubjectComponentModule } from '@pages/fund/shared/component/fund-subject/fund-subject-component.module';

// ---------------- Pages Start ---------------- //
import { SearchSetPageComponent } from '../search-set/search-set-page.component';
// ---------------- API Start ---------------- //
import { FI000801ApiService } from '@api/fi/fI000801/fi000801-api.service';
import { FI000802ApiService } from '@api/fi/fi000802/fi000802-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FlagFormateModule,
    SearchSetRoutingModule,
    NumberFormateModule,
    PaginatorCtrlModule,
    ExpandListModule,  // 展開列表
    FundFormateModule,
    BookmarkModule,
    FundSubjectComponentModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FI000801ApiService,
    FI000802ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    SearchSetPageComponent,
  ]
})
export class SearchSetModule { }
