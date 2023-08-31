import { NgModule } from '@angular/core';
import { DayRemittanceRoutingModule } from './day-remittance-routing.module';
import { SharedModule } from '@shared/shared.module';
// ---------------- Module Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { DayRemittanceServiceModule } from '../shared/service/day-remittance-service.module';
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module';

// ---------------- Pages Start ---------------- //
import { DayRemitListMainPageComponent } from './day-remit-list-mainpage/day-remit-lsit-mainpage.component';
// import { DayRemittanceContentComponent } from './day-remit-detail-mainpage/day-remit-detail-mainpage.component';


// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


// ---------------- Shared Start ---------------- //
import { DayRemitListPaginatorComponent } from './day-remit-list-mainpage/day-remit-list-paginator/day-remit-list-paginator.component';
import { DayRemitDetailModule } from './day-remit-detail-mainpage/day-remit-detail.module';


@NgModule({
    imports: [
        SharedModule
        , DayRemittanceRoutingModule
        , PaginatorCtrlModule
        , DayRemittanceServiceModule
        , DayRemitDetailModule
        , DepositMaskModule // 帳戶別
    ],
    providers: [
        // ---------------- Service Start ---------------- //

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        DayRemitListMainPageComponent,
        DayRemitListPaginatorComponent,

    ],
    entryComponents: [
        DayRemitListPaginatorComponent
    ]
})
export class DayRemittanceModule { }
