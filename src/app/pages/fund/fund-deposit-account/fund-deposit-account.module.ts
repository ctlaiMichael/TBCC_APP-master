/**
 * Route定義
 * 現金收益存入帳號異動
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundDepositAccountRoutingModule } from './fund-deposit-account-routing.module';

// ---------------- Pages Start ---------------- //
import { FundDepositAccountComponent } from './fund-deposit-account.component';
import { DepositAccountPageComponent } from './pages/deposit-account-page.component'; // 列表分頁
import { DepositAccountContentComponent } from './content/deposit-account-content.component'; // 內容頁
import { DepositAccountResultComponent } from './result/deposit-account-result.component'; // 結果頁
// ---------------- Service Start ---------------- //
import { FundDepositAccountServiceModule } from '@pages/fund/shared/service/fundDepositAccount-service.module';
// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000701ApiService } from '@api/fi/fi000701/fi000701-api.service';
import { FI000702ApiService } from '@api/fi/fi000702/fi000702-api.service';
import { FI000704ApiService } from '@api/fi/fi000704/fi000704-api.service';
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { TwdToForeignServiceModule } from '@pages/foreign-exchange/shared/service/twd-to-foreign.service.module';

@NgModule({
    imports: [
        SharedModule,
        FundDepositAccountRoutingModule,
        PaginatorCtrlModule,
        FundDepositAccountServiceModule,
        SelectSecurityModule,
        CheckSecurityModule,
        TwdToForeignServiceModule
    ],
    providers: [
        FI000701ApiService,
        FI000702ApiService,
        FI000704ApiService,
    ],
    declarations: [
        // == 列表 == //
        FundDepositAccountComponent,
        // == 列表-分頁 == //
        DepositAccountPageComponent,
        // == 內容頁 == //
        DepositAccountContentComponent,
        // == 結果頁 == //
        DepositAccountResultComponent
    ],
    // (分頁設定)
    entryComponents: [
        DepositAccountPageComponent
    ]
})
export class FundDepositAccountModule {
    constructor(
    ) {
    }
}
