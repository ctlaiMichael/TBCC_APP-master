import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReservationSearchWriteoffRoutingModule } from './reservation-search-writeoff-routing.module';
import { AmountFormateModule } from '@shared/formate/number/amount/amount-formate.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

// ---------------- Pages Start ---------------- //
import { ReservationSearchWriteoffPageComponent } from './reservation-search-writeoff-page.component';
import { ReservationSearchWriteoffConfirmPageComponent } from './reservation-search-writeoff-confirm-page.component';
import { ReservationSearchWriteoffResultPageComponent } from './reservation-search-writeoff-result-page.component';

// ---------------- API Start ---------------- //
import { F4000501ApiService } from '@api/f4/f4000501/f4000501-api.service';
import { F4000502ApiService } from '@api/f4/f4000502/f4000502-api.service';


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    ReservationSearchWriteoffRoutingModule,
    AmountFormateModule,          // 金額pipe
    SelectSecurityModule,         // 安控機制
    CheckSecurityModule,          // 安控機制
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F4000501ApiService,
    F4000502ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    ReservationSearchWriteoffPageComponent,
    ReservationSearchWriteoffConfirmPageComponent,
    ReservationSearchWriteoffResultPageComponent
  ]
})
export class ReservationSearchWriteoffModule { }
