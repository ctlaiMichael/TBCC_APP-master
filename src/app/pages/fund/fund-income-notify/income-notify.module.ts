/**
 * Route定義
 * 停損獲利點通知
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { IncomeNotifyRoutingModule } from './income-notify-routing.module';

// ---------------- Pages Start ---------------- //
import { IncomeNotifyComponent } from './income-notify.component';
import { IncomeNotifyPageComponent } from './pages/income-notify-page.component'; // 列表分頁
// ---------------- Service Start ---------------- //
// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { FI000605ApiService } from '@api/fi/fI000605/fi00605-api.service';

@NgModule({
    imports: [
        SharedModule,
        IncomeNotifyRoutingModule,
        PaginatorCtrlModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // FB000501ApiService,
        // FB000502ApiService
        FI000605ApiService,

    ],
    declarations: [
        // == 列表 == //
        IncomeNotifyComponent,
        // == 列表-分頁 == //
        IncomeNotifyPageComponent,
    ],
    // (分頁設定)
    entryComponents: [
        IncomeNotifyPageComponent
    ]
})
export class IncomeNotifyModule {
    constructor(
    ) {
    }
}
