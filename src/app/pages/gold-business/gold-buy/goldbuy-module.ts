import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { GoldbuyRoutingModule } from '@pages/gold-business/gold-buy/goldbuy-routing-module';
import { GoldBusinessSharedModule } from '@pages/gold-business/shared/gold-business-shared.module';

import { GoldbuyStatementComponent } from '@pages/gold-business/gold-buy/statement/goldbuy-statement.component';
import { GoldbuyEditPageComponent } from '@pages/gold-business/gold-buy/edit/goldbuy-edit-page.component';
import { GoldbuyConfirmPageComponent } from '@pages/gold-business/gold-buy/confirm/goldbuy-confirm-page.component';


// ---------------- API Start ---------------- //

import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000708ApiService } from 'app/api/fb/fb000708/fb000708-api.service';
import { FB000709ApiService } from 'app/api/fb/fb000709/fb000709-api.service';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        GoldbuyRoutingModule,
        GoldBusinessSharedModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000708ApiService
        , FB000709ApiService
        , FB000705ApiService
        , GoldSellBuyService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        GoldbuyStatementComponent
        , GoldbuyEditPageComponent
        , GoldbuyConfirmPageComponent
    ],
    exports: [
    ]
})
export class GoldbuyModule { }