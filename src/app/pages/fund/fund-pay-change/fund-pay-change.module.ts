/**
 * Route定義
 * 定期不定額查詢異動
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundPayChangeRoutingModule } from './fund-pay-change-routing.module';

// ---------------- Pages Start ---------------- //
import { FundPayChangeComponent } from './fund-pay-change.component';
import { PayChangePageComponent } from './pages/pay-change-page.component'; // 列表分頁
import { PayChangeContentComponent } from './content/pay-change-content.component'; // 內容頁
import { PayChangeResultComponent } from './result/pay-change-result.component'; // 結果頁
// ---------------- Service Start ---------------- //
import { PayChangeResultServiceModule } from '@pages/fund/shared/service/pay-change-result-service.module';
// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000701ApiService } from '@api/fi/fi000701/fi000701-api.service';
import { FI000702ApiService } from '@api/fi/fi000702/fi000702-api.service';
import { FI000703ApiService } from '@api/fi/fi000703/fi000703-api.service';
import { FI000704ApiService } from '@api/fi/fi000704/fi000704-api.service';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service';
import { FI000711ApiService } from '@api/fi/fi000711/fi000711-api.service';
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { FundSubjectComponentModule } from '@pages/fund/shared/component/fund-subject/fund-subject-component.module';
import { DateSelectModule } from '@shared/popup/date-select-popup/date-select.module';
import { FundDeleteServiceModule } from '@pages/fund/shared/service/fund-delete-service.module';
import { TwdToForeignServiceModule } from '@pages/foreign-exchange/shared/service/twd-to-foreign.service.module';

@NgModule({
    imports: [
        SharedModule,
        FundPayChangeRoutingModule,
        PaginatorCtrlModule,
        PayChangeResultServiceModule,
        SelectSecurityModule,
        CheckSecurityModule,
        FundSubjectComponentModule,
        DateSelectModule,
        FundDeleteServiceModule,
        TwdToForeignServiceModule
    ],
    providers: [
        FI000701ApiService,
        FI000702ApiService,
        FI000703ApiService,
        FI000704ApiService,
        FI000401ApiService,
        FI000711ApiService
    ],
    declarations: [
        // == 列表 == //
        FundPayChangeComponent,
        // == 列表-分頁 == //
        PayChangePageComponent,
        // == 內容頁 == //
        PayChangeContentComponent,
        // == 結果頁 == //
        PayChangeResultComponent
    ],
    // (分頁設定)
    entryComponents: [
        PayChangePageComponent
    ]
})
export class FundPayChangeModule {
    constructor(
    ) {
    }
}
