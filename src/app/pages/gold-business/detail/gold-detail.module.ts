
import { NgModule } from '@angular/core';
import { GoldDetailRoutingModule } from './gold-detail-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { ForeignListComponent } from '@pages/foreign-exchange/foreign-deposit/list/foreign-list-page.component';


// ---------------- API Start ---------------- //
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service';


// ---------------- Service Start ---------------- //
import { ForeignDepositService } from '@pages/foreign-exchange/shared/service/foreign-deposit.service';

// import { WINDOW_PROVIDERS } from '@pages/foreign-exchange/shared/service/windows.service';
// import { DetailCustomComponent } from './tab/detail-custom.component';

// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { CommonModule } from '@angular/common';
import { GoldDetailService } from '../shared/service/gold-detail.service';
import { GoldDetailPageComponent } from './gold-detail-page/gold-detail-page.component';
import { GoldListPageComponent } from './gold-list-page/gold-list-page.component';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000706ApiService } from '@api/fb/fb000706/fb000706-api.service';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';
import { F2100101ApiService } from '@api/f2/f2100101/f2100101-api.service';
import { FB000707ApiService } from '@api/fb/fb000707/fb000707-api.service';
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module';


@NgModule({
  imports: [
    SharedModule,
    GoldDetailRoutingModule,
    DateRangeSearchComponentModule,
    PaginatorCtrlModule,
    CommonModule,
    DepositMaskModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    // DepositInquiryDetailService,
    FB000705ApiService,
    FB000706ApiService,
    FB000707ApiService,
    // F2100101ApiService,
    GoldDetailService
    // , WINDOW_PROVIDERS
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    GoldDetailPageComponent,
    GoldListPageComponent
  ]

  // //hostListener設定
  // entryComponents: [
  //   ForeignListComponent
  // ]
})
export class GoldDetailModule { }
