/**
 * Route定義
 * 繳卡費
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { CardPayRoutingModule } from './card-pay-routing.module';
import { CardBillServiceModule } from '../shared/service/card-bill-service/card-bill-service.module';
import { NgxBarcodeModule } from 'ngx-barcode';
// ---------------- Pages Start ---------------- //
import { PayVaCardComponent } from './pay-va-card/pay-va-card.component';
import { PayMarketCardComponent } from './pay-market-card/pay-market-card.component';
// ---------------- API Start ---------------- //
import { F8000401ApiService } from '@api/f8/f8000401/f8000401-api.service';
import { F8000402ApiService } from '@api/f8/f8000402/f8000402-api.service';
import { FC000403ApiService } from '@api/fc/fc000403/fc000403-api.service';
import { FC000404ApiService } from '@api/fc/fc000404/fc000404-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    CardPayRoutingModule,
    SelectSecurityModule,
    CheckSecurityModule ,
    CardBillServiceModule,
    NgxBarcodeModule
  ],
  providers: [
    // ---------------- Service Start ---------------- /
    F8000401ApiService,
    F8000402ApiService,
    FC000403ApiService,
    FC000404ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    PayVaCardComponent,
    PayMarketCardComponent
  ]
})
export class CardPayModule { }
