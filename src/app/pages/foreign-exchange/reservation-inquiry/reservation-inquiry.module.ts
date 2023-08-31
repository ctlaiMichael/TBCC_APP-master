import { NgModule } from '@angular/core';
import { ReservationInquiryRoutingModule } from './reservation-inquiry-routing.module';

import { SharedModule } from '@shared/shared.module';
// ---------------- 安控 Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //
import { ReservationInquiryComponent } from './inquiry/reservation-inquiry-page.component';
import { ReservationConfirmComponent } from './confirm/reservation-confirm-page.component';
import { ReservationResultComponent } from './result/reservation-result-page.component';
import { ReservationInquiryService } from '@pages/foreign-exchange/shared/service/reservation-inquiry.service';
import { F5000106ApiService } from '@api/f5/f5000106/f5000106-api.service';
import { F5000107ApiService } from '@api/f5/f5000107/f5000107-api.service';

// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //





@NgModule({
  imports: [
    SharedModule
    , ReservationInquiryRoutingModule
    , SelectSecurityModule         // 安控機制
    , CheckSecurityModule         // 安控機制
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    ReservationInquiryService
    , F5000106ApiService
    , F5000107ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    ReservationInquiryComponent
    , ReservationResultComponent
    , ReservationConfirmComponent
  ],

})
export class ReservationInquiryModule { }
