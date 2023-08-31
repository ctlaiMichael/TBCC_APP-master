import { NgModule } from '@angular/core';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { SharedModule } from '@shared/shared.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { LoanContentModule } from './detail-mainPage/loan-content.module';

// ---------------- Pages Start ---------------- //
import { LoanInquiryPaginatorComponent } from './pagniator/loan-inquiry-paginator.component';
import { LoanInquiryMainComponent } from './mainPage/loan-inquiry-mainpage.component';


// ---------------- API Start ---------------- //
import { F9000101ApiService } from '@api/f9/f9000101/f9000101-api.service';
import { F9000201ApiService } from '@api/f9/f9000201/f9000201-api.service';


// ---------------- Service Start ---------------- //
import { CreditInquiryService } from '../shared/service/credit-inquiry.service';




@NgModule({
    imports: [
        SharedModule
        , InquiryRoutingModule
        , PaginatorCtrlModule
        , LoanContentModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        CreditInquiryService
        , F9000101ApiService
        , F9000201ApiService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        LoanInquiryPaginatorComponent
        , LoanInquiryMainComponent
    ],
    entryComponents: [
        LoanInquiryPaginatorComponent
    ]
})
export class InquiryModule { }
