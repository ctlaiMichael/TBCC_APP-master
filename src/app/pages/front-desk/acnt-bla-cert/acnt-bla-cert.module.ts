/**
 * 線上申請存款餘額證明
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// // ---------------- Model Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { AcntBlaCertRoutingModule } from './acnt-bla-cert.routing.module';


// ---------------- Model Start ---------------- //
import { StepBarModule } from '@shared/template/stepbar/step-bar.module';
// ---------------- Pages Start ---------------- //
import { AcntBlaCertPageComponent } from './acnt-bla-cert-page.component';
import { AcntBlaCertResultComponent } from './result/acnt-bla-cert-result-page.component';

// ---------------- Service Start ---------------- //
import { FJ000102ApiService } from '@api/fj/fj000102/fj000102-api.service';
import { FJ000103ApiService } from '@api/fj/fj000103/fj000103-api.service';
import { AcntBlaCertService } from '../shared/service/acnt-bla-cert.service';
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //


@NgModule({
    imports: [
        SharedModule
        , AcntBlaCertRoutingModule
        , CheckSecurityModule
        , SelectSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FJ000102ApiService,
        FJ000103ApiService,
        AcntBlaCertService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        AcntBlaCertPageComponent
        , AcntBlaCertResultComponent
    ],
    exports: [
    ]
})
export class AcntBlaCertModule { }
