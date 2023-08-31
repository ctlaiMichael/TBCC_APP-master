/**
 * 台幣存款查詢
 */
import { NgModule } from '@angular/core';
import { DepositOverviewRoutingModule } from './deposit-overview-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Module Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module'; // 分頁
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
import { ExpandListModule } from '@shared/template/list/expand/expand-list.module'; // 展開列表
// ---------------- Module Start (Deposti) ---------------- //
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module'; // 帳戶別相關處理
import { AccountContentComponentModule } from '@shared/template/deposit/account-content/account-content-component.module'; // 帳戶資訊
import { DepositInquiryServiceModule } from '@pages/deposit/shared/deposit-inquiry-service.module'; // 存款查詢
import { DepositDetailServiceModule } from '@pages/deposit/shared/deposit-detail-service.module'; // 台幣交易明細查詢
// ---------------- Pages Start ---------------- //
import { OverviewMainPageComponent } from './overview-mainpage/overview-mainpage.component';
import { OverviewPaginatorComponent } from './overview-mainpage/overview-paginator/overview-paginator.component';
// 定存
import { TimeDepositComponent } from './time-deposit/time-deposit.component';
// 活存
import { OverviewContentModule } from './overview-content/overview-content.module';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //


// ---------------- Shared Start ---------------- //



@NgModule({
    imports: [
        SharedModule
        , DepositOverviewRoutingModule
        // == library == //
        , PaginatorCtrlModule // 分頁
        , ExpandListModule // 展開列表
        // == library(deposit) == //
        , DepositMaskModule // 帳戶別
        , AccountContentComponentModule
        // == service == //
        , DepositInquiryServiceModule // 存款查詢
        , DepositDetailServiceModule // 台幣交易明細
        // == page == //
        , OverviewContentModule // 活支存交易明細page
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        OverviewMainPageComponent,
        OverviewPaginatorComponent,
        // 定存
        TimeDepositComponent
    ],
    entryComponents: [
        OverviewPaginatorComponent
    ]
})
export class DepositOverviewModule { }
