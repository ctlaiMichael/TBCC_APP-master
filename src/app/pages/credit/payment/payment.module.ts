import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PaymentRoutingModule } from './payment-routing.module';

// ---------------- Pages Start ---------------- //
import { PaymentComponent } from './payment-page.component';
import { InfoCheckPageComponent } from './info-check/info-check-page.component';
import { PaymentEditPageComponent } from './edit/payment-edit-page.component';
import { PaymentConfirmPageComponent } from './confirm/payment-confirm-page.component';
import { PaymentResultComponent } from './result/payment-result-page.component';




// ---------------- API Start ---------------- //
import { F9000301ApiService } from '@api/f9/f9000301/f9000301-api.service';
import { F9000302ApiService } from '@api/f9/f9000302/f9000302-api.service';
import { F9000303ApiService } from '@api/f9/f9000303/f9000303-api.service';
import { PaymentOverduePageComponent } from './overdue/payment-overdue-page.component';
import { AmountFormateModule } from '@shared/formate/number/amount/amount-formate.module';
import { PaymentPaginator } from './mainPage/paginator/payment-paginator.component';
import { PaymentMainComponent } from './mainPage/payment-mainpage.component';


// ---------------- Service Start ---------------- //



@NgModule({
    imports: [
        SharedModule
        , PaymentRoutingModule
        , SelectSecurityModule
        , CheckSecurityModule
        , AmountFormateModule        // 轉帳金額檢核
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        F9000301ApiService,
        F9000302ApiService,
        F9000303ApiService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        PaymentComponent
        , InfoCheckPageComponent
        , PaymentEditPageComponent
        , PaymentConfirmPageComponent
        , PaymentResultComponent
        , PaymentOverduePageComponent
        , PaymentMainComponent
        , PaymentPaginator
    ],

})
export class PaymentModule { }
