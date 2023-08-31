/**
 * 外幣存款查詢-[定/綜定]存交易明細
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// ---------------- Module Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module'; // 分頁
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { DayRemitDetailMainPageComponent } from './day-remit-detail-mainpage.component';
import { DayRemitDetailPaginatorComponent } from './day-remit-detail-paginator/day-remit-detail-paginator.component';
import { DayRemittanceServiceModule } from '@pages/deposit/shared/service/day-remittance-service.module';


// ---------------- Shared Start ---------------- //


@NgModule({
    imports: [
        SharedModule
        , PaginatorCtrlModule // 分頁
        , DayRemittanceServiceModule
        , DepositMaskModule // 帳戶別
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        // 活存
        DayRemitDetailMainPageComponent,
        DayRemitDetailPaginatorComponent
    ],
    exports: [
        // 主要page放出來即可
        DayRemitDetailMainPageComponent
    ],
    entryComponents: [
        DayRemitDetailPaginatorComponent
    ]
})
export class DayRemitDetailModule { }
