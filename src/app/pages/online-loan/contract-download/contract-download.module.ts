/**
 * 線上約據下載
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { ContractDownloadRoutingModule } from './contract-download-routing.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';

// ---------------- Pages Start ---------------- //
import { DownloadSearchPageComponent } from './search/download-search-page.component';
import { DownloadDetailPageComponent } from './detail/download-detail-page.component';
import { DownloadResultPageComponent } from './result/download-result-page.component';
import { DownloadMainPageComponent } from './download-main/download-main-page.component';
// ---------------- API Start ---------------- //
import { F9000501ApiService } from '@api/f9/f9000501/f9000501-api.service';
import { F9000503ApiService } from '@api/f9/f9000503/f9000503-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MenuTempModule,
    ContractDownloadRoutingModule,
    PaginatorCtrlModule,
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F9000501ApiService,
    F9000503ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    DownloadMainPageComponent,
    DownloadSearchPageComponent,
    DownloadDetailPageComponent,
    DownloadResultPageComponent
  ]
})
export class  ContractDownloadModule { }
