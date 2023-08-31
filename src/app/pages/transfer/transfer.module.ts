import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { TransferRoutingModule } from './transfer-routing.module';
import { TwdTransferModule } from './twd-transfer/twd-transfer.module';
import { CurrentToFixedModule } from './current-to-fixed/current-to-fixed.module';
import { ReservationSearchWriteoffModule } from './reservation-search-writeoff/reservation-search-writeoff.module';

// ---------------- Pages Start ---------------- //

import { TransferPageComponent } from './transfer-page.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MenuTempModule,
    TransferRoutingModule,
    TwdTransferModule,
    CurrentToFixedModule,
    ReservationSearchWriteoffModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    TransferPageComponent
  ]
})
export class TransferModule { }
