/**
 * Route定義
 * 基金轉換
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundConvertRoutingModule } from './fund-convert-routing.module';

// ---------------- Pages Start ---------------- //
import { FundConvertComponent } from './fund-convert.component';
import { FundConvertPageComponent } from './pages/fund-convert-page.component'; // 列表分頁
import { FundConvertContentComponent } from './content/fund-convert-content.component'; // 內容頁
import { FundConvertResultComponent } from './result/fund-convert-result.component'; // 結果頁
// ---------------- Service Start ---------------- //
import { FI000701ApiService } from '@api/fi/fi000701/fi000701-api.service';
import { FI000702ApiService } from '@api/fi/fi000702/fi000702-api.service';
import { FI000703ApiService } from '@api/fi/fi000703/fi000703-api.service';
import { FI000704ApiService } from '@api/fi/fi000704/fi000704-api.service';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service';
import { FI000711ApiService } from '@api/fi/fi000711/fi000711-api.service';
import { FI000501ApiService } from '@api/fi/fI000501/fI000501-api.service';
import { FI000502ApiService } from '@api/fi/fI000502/fI000502-api.service';
import { FI000507ApiService } from '@api/fi/fI000507/fI000507-api.service';
import { FI000508ApiService } from '@api/fi/fI000508/fI000508-api.service';
import { FI000509ApiService } from '@api/fi/fI000509/fI000509-api.service';
import { FI000510ApiService } from '@api/fi/fI000510/fI000510-api.service';
import { FI000511ApiService } from '@api/fi/fI000511/fI000511-api.service';
import { FI000512ApiService } from '@api/fi/fI000512/fI000512-api.service';
// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { FundSubjectComponentModule } from '@pages/fund/shared/component/fund-subject/fund-subject-component.module';
import { DateSelectModule } from '@shared/popup/date-select-popup/date-select.module';
import { EnterAgreeContentComponentModule } from '@conf/terms/fund/enter-agree-content/enter-agree-content-component.module';

@NgModule({
    imports: [
        SharedModule,
        FundConvertRoutingModule,
        PaginatorCtrlModule,
        SelectSecurityModule,
        CheckSecurityModule,
        FundSubjectComponentModule,
        DateSelectModule,
        EnterAgreeContentComponentModule
    ],
    providers: [
        // FB000501ApiService,
        // FB000502ApiService
        FI000701ApiService,
        FI000702ApiService,
        FI000703ApiService,
        FI000704ApiService,
        F5000101ApiService,
        F5000103ApiService,
        F5000105ApiService,
        F5000102ApiService,
        FI000401ApiService,
        FI000711ApiService,
        FI000501ApiService,
        FI000502ApiService,
        FI000507ApiService,
        FI000508ApiService,
        FI000509ApiService,
        FI000510ApiService,
        FI000511ApiService,
        FI000512ApiService
    ],
    declarations: [
        // == 列表 == //
        FundConvertComponent,
        // == 列表-分頁 == //
        FundConvertPageComponent,
        // == 內容頁 == //
        FundConvertContentComponent,
        // == 結果頁 == //
        FundConvertResultComponent
    ],
    // (分頁設定)
    entryComponents: [
        FundConvertPageComponent
    ]
})
export class FundConvertModule {
    constructor(
    ) {
    }
}
