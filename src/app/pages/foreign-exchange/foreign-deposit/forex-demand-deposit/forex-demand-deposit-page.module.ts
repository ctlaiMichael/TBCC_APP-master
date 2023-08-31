/**
 * 外幣存款查詢-[定/綜定]存交易明細
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// ---------------- Module Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module'; // 分頁
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
import { ExpandListModule } from '@shared/template/list/expand/expand-list.module'; // 展開列表
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module'; // 帳戶別相關處理
import { DepositAmountComponentModule } from '@shared/template/deposit/deposit-amount/deposit-amount-component.module'; // 支出存入
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module'; // 日期搜尋框
import { AccountContentComponentModule } from '@shared/template/deposit/account-content/account-content-component.module'; // 帳戶資訊
import { ContentSummaryComponentModule } from '@shared/template/deposit/content-summary/content-summary-component.module'; // 帳戶彙總
// ---------------- Pages Start ---------------- //
import { ForexdepositDetailServiceModule } from '@pages/foreign-exchange/shared/service/forexdeposit-detail-service.module'; // 外幣交易明細查詢
// 活存
import { ForexDemandDepositPageComponent } from './forex-demand-deposit-page.component';
import { ForexDemandPaginatorComponent } from './forex-demand-paginator/forex-demand-paginator.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //


// ---------------- Shared Start ---------------- //


@NgModule({
    imports: [
        SharedModule
        , PaginatorCtrlModule // 分頁
        , BookmarkModule // 頁籤
        , ExpandListModule // 展開列表
        , DepositMaskModule // 帳戶別
        , AccountContentComponentModule // 帳戶資訊
        , DepositAmountComponentModule // 支出存入
        , DateRangeSearchComponentModule // 日期搜尋box
        , ContentSummaryComponentModule
        , ForexdepositDetailServiceModule // 外幣交易明細
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        // 活存
        ForexDemandDepositPageComponent,
        ForexDemandPaginatorComponent
    ],
    exports: [
        // 主要page放出來即可
        ForexDemandDepositPageComponent
    ],
    entryComponents: [
        ForexDemandPaginatorComponent
    ]
})
export class ForexDemandDepositPageModule { }
