/**
 * Route定義
 * 信託業務推介
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundNetworkRoutingModule } from './fund-network-routing.module';

// ---------------- Pages Start ---------------- //
import { FundNetworkComponent } from './fund-network.component';
// ---------------- Service Start ---------------- //
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

@NgModule({
    imports: [
        SharedModule,
        FundNetworkRoutingModule,
        PaginatorCtrlModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [

    ],
    declarations: [
        // == 列表 == //
        FundNetworkComponent
    ],
    // (分頁設定)
    entryComponents: [
    ]
})
export class FundNetworkModule {
    constructor(
    ) {
    }
}
