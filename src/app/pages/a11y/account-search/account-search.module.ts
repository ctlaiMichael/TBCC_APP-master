import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountSearchRoutingModule } from './account-search-routing.module';
import { AccountSearchA11yPageComponent } from './account-search-a11y-page/account-search-a11y-page.component';
import { SharedModule } from '@shared/shared.module';
import { A11yModule } from '../a11y.module';

/**
 * 台幣存款查詢
 */
import { TaiwanDepositA11yPageComponent } from './taiwan-deposit-a11y-page/taiwan-deposit-a11y-page.component';
import { TaiwanDepositPageboxA11yPage } from './taiwan-deposit-a11y-page/taiwan-deposit-pagebox-a11y-page.component';
import { SearchA11yPageComponent } from './taiwan-deposit-a11y-page/search-a11y-page/search-a11y-page.component';
import { DetailA11yPageComponent } from './taiwan-deposit-a11y-page/detail-a11y-page/detail-a11y-page.component';
import { MoreDetailA11yPageComponent } from './taiwan-deposit-a11y-page/more-detail-a11y-page/more-detail-a11y-page.component';
import { DetailPageboxA11yPageComponent } from './taiwan-deposit-a11y-page/detail-pagebox-a11y-page/detail-pagebox-a11y-page.component';
/**
 * 外幣存款查詢
 */
import { ForeignDepositA11yPageComponent } from './foreign-deposit-a11y-page/foreign-deposit-a11y-page.component';
import { ForeignDepositPageboxA11yPage } from './foreign-deposit-a11y-page/foreign-deposit-pagebox-a11y-page.component';
import { ForeignSearchA11yPageComponent } from './foreign-deposit-a11y-page/foreign-search-a11y-page/foreign-search-a11y-page.component';
import { ForeignDetailA11yPageComponent } from './foreign-deposit-a11y-page/foreign-detail-a11y-page/foreign-detail-a11y-page.component';
import { ForeignMoreDetailA11yPageComponent } from './foreign-deposit-a11y-page/foreign-more-detail-a11y-page/foreign-more-detail-a11y-page.component';
import { ForeignDetailPageboxA11yPageComponent } from './foreign-deposit-a11y-page/foreign-detail-pagebox-a11y-page/foreign-detail-pagebox-a11y-page.component';
// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { ContentSummaryService } from '@shared/template/deposit/content-summary/content-summary.service';
import { ForeignDepositService } from '@pages/foreign-exchange/shared/service/foreign-deposit.service';
import { DateA11yService } from '@pages/a11y/account-search/shared/date-a11y.service';

// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { DepositInquiryServiceModule } from '@pages/deposit/shared/deposit-inquiry-service.module';
import { DepositDetailServiceModule } from '@pages/deposit/shared/deposit-detail-service.module';
import { ForexdepositDetailServiceModule } from '@pages/foreign-exchange/shared/service/forexdeposit-detail-service.module';










@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    AccountSearchRoutingModule,
    PaginatorCtrlModule,
    DepositInquiryServiceModule,
    DepositDetailServiceModule,
    ForexdepositDetailServiceModule
    // A11yModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    // ---------------- Service Start ---------------- //
    // 台幣
    DateA11yService,
    ContentSummaryService
  ],
  declarations: [
    // 台幣存款查詢
    TaiwanDepositA11yPageComponent,
    TaiwanDepositPageboxA11yPage,
    SearchA11yPageComponent,
    DetailA11yPageComponent,
    DetailPageboxA11yPageComponent,
    MoreDetailA11yPageComponent,
    // 外匯存款查詢
    ForeignDepositA11yPageComponent,
    ForeignDepositPageboxA11yPage,
    ForeignMoreDetailA11yPageComponent,
    ForeignDetailA11yPageComponent,
    ForeignDetailPageboxA11yPageComponent,
    ForeignSearchA11yPageComponent
  ],
  entryComponents: [
    TaiwanDepositPageboxA11yPage,
    ForeignDepositPageboxA11yPage,
    DetailPageboxA11yPageComponent,
    ForeignDetailPageboxA11yPageComponent
  ],
})
export class AccountSearchModule { }
