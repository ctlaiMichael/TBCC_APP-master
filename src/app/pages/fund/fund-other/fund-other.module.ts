import { NgModule } from '@angular/core';
import { OtherRoutingModule } from '@pages/fund/fund-other/fund-other-routing.module';
import { FundKYCServiceModule } from '../shared/service/fund-KYC-service.module';
import { SharedModule } from '@shared/shared.module';
import { RiskTestPageComponent } from './riskTest/risk-test-page.component';
import { RiskTestQuestionComponent } from './riskTest/risk-test-list/risk-test-question.component';
import { RiskTestResultComponent } from './riskTest/risk-test-result/risk-test-result.component';
import { PersonCapitalModule } from '@conf/terms/fund/person-capital/person-capital-component.module';
import { SafeCheckPageComponent } from './safe-check/safe-check-page.component';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { BaseDataPageComponent } from './base-data/base-data-page.component';
import { SearchSetListPageComponent } from './search-set-list/search-set-list-page.component';

// ---------------- Pages Start ---------------- //



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        OtherRoutingModule,
        FundKYCServiceModule,
        PersonCapitalModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        RiskTestPageComponent,
        RiskTestQuestionComponent,
        RiskTestResultComponent,
        SafeCheckPageComponent,
        BaseDataPageComponent,
        SearchSetListPageComponent
    ]
})
export class FundOtherModule { }
