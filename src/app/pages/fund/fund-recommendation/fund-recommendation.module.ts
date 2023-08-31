/**
 * Route定義
 * 信託業務推介
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundRecommendationRoutingModule } from './fund-recommendation-routing.module';

// ---------------- Pages Start ---------------- //
import { FundRecommendationComponent } from './fund-recommendation.component';
import { RecommendationContentComponent } from './content/recommendation-content.component'; // 列表分頁
// ---------------- Service Start ---------------- //
// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { FI000605ApiService } from '@api/fi/fI000605/fi00605-api.service';
import { EnterRecommendationComponentModule } from '@conf/terms/fund/enter-recommendation-content/enter-recommendation-component.module';

@NgModule({
    imports: [
        SharedModule,
        FundRecommendationRoutingModule,
        PaginatorCtrlModule,
        SelectSecurityModule,
        CheckSecurityModule,
        EnterRecommendationComponentModule
    ],
    providers: [
        // FB000501ApiService,
        // FB000502ApiService
        FI000605ApiService,

    ],
    declarations: [
        // == 列表 == //
        FundRecommendationComponent,
        // == 列表-分頁 == //
        RecommendationContentComponent,
    ],
    // (分頁設定)
    entryComponents: [
        RecommendationContentComponent
    ]
})
export class FundRecommendationModule {
    constructor(
    ) {
    }
}
