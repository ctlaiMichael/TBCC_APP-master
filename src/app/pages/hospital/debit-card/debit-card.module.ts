import { NgModule } from '@angular/core';
import { DebitCardRoutingModule } from './debit-card-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HaspayQueryModule } from '../haspay-query/haspay-query.module';
import { AccountSetModule } from '../account-set/account-set.module';

// ---------------- Pages Start ---------------- //
// ---------------- API Start ---------------- //
import { FH000103ApiService } from '@api/fh/fh000103/fh000103-api.service';
import { FH000104ApiService } from '@api/fh/fh000104/fh000104-api.service';
import { DebitCardPageComponent } from './debit-card-page.component';
import { MatmBackPageComponent } from '../matm-back/matm-back-page.component';
import { FH000207ApiService } from '@api/fh/fh000207/fh000207-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    DebitCardRoutingModule,
    HaspayQueryModule,
    AccountSetModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FH000207ApiService
  ],
  declarations: [
    DebitCardPageComponent
    // ---------------- Pages Start ---------------- //
  ]
})
export class DebitCardModule { }
