import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { GoldtermsRoutingModule } from '@pages/gold-business/goldterms/goldterms-routing.module';
import { GoldBusinessSharedModule } from '@pages/gold-business/shared/gold-business-shared.module';

import { GoldtermsStatementComponent } from '@pages/gold-business/goldterms/statement/goldterms-statement.component';
import { GoldtermsSelectacctPageComponent } from '@pages/gold-business/goldterms/selectacct/goldterms-selectacct-page.component';
import { GoldtermsEditPageComponent } from '@pages/gold-business/goldterms/edit/goldterms-edit-page.component';
import { GoldtermsConfirmPageComponent } from '@pages/gold-business/goldterms/confirm/goldterms-confirm-page.component';
import { GoldtermsResultPageComponent } from '@pages/gold-business/goldterms/result/goldterms-result-page.component';


// ---------------- API Start ---------------- //

import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000710ApiService } from 'app/api/fb/fb000710/fb000710-api.service';
import { FB000711ApiService } from 'app/api/fb/fb000711/fb000711-api.service';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';
import { GoldTermsService } from '@pages/gold-business/shared/service/gold-terms.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        GoldtermsRoutingModule,
        GoldBusinessSharedModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000710ApiService
        , FB000711ApiService
        , FB000705ApiService
        , GoldSellBuyService
        , GoldTermsService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        GoldtermsStatementComponent
        , GoldtermsSelectacctPageComponent
        , GoldtermsEditPageComponent
        , GoldtermsConfirmPageComponent
        , GoldtermsResultPageComponent
    ],
    exports: [
    ]
})
export class GoldtermsModule { }