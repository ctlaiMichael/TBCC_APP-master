/**
 * Route定義
 * 現金收益存入帳號異動
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundReserveCancelRoutingModule } from './fund-reserve-cancel-routing.module';

// ---------------- Pages Start ---------------- //
import { FundReserveCancelComponent } from './fund-reserve-cancel.component';
import { ReserveCancelPageComponent } from './pages/reserve-cancel-page.component'; // 列表分頁
import { ReserveCancelContentComponent } from './content/reserve-cancel-content.component'; // 內容頁
import { ReserveCancelResultComponent } from './result/reserve-cancel-result.component'; // 結果頁
// // ---------------- Service Start ---------------- //
// import { FundReserveCancelServiceModule } from '@pages/fund/shared/service/FundReserveCancel-service.module';
// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000601ApiService } from '@api/fi/fi000601/fi000601-api.service';
import { FI000602ApiService } from '@api/fi/fi000602/fi000602-api.service';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

@NgModule({
    imports: [
        SharedModule,
        FundReserveCancelRoutingModule,
        PaginatorCtrlModule,
        // FundReserveCancelServiceModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        FI000601ApiService,
        FI000602ApiService,
        F5000101ApiService,
        F5000103ApiService,
        F5000105ApiService
    ],
    declarations: [
        // == 列表 == //
        FundReserveCancelComponent,
        // == 列表-分頁 == //
        ReserveCancelPageComponent,
        // // == 內容頁 == //
        ReserveCancelContentComponent,
        // // == 結果頁 == //
        ReserveCancelResultComponent
    ],
    // (分頁設定)
    entryComponents: [
        ReserveCancelPageComponent
    ]
})
export class FundReserveCancelModule {
    constructor(
    ) {
    }
}
