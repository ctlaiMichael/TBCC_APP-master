import { NgModule } from '@angular/core';
import { MatmBackRoutingModule } from './matm-back-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HaspayQueryModule } from '../haspay-query/haspay-query.module';
import { AccountSetModule } from '../account-set/account-set.module';

// ---------------- Pages Start ---------------- //
// ---------------- API Start ---------------- //
import { FH000103ApiService } from '@api/fh/fh000103/fh000103-api.service';
import { FH000104ApiService } from '@api/fh/fh000104/fh000104-api.service';
import { FH000207ApiService } from '@api/fh/fh000207/fh000207-api.service';
import { MatmBackPageComponent } from './matm-back-page.component';
import { FH000204ApiService } from '@api/fh/fh000204/fh000204-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MatmBackRoutingModule,
    HaspayQueryModule,
    AccountSetModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FH000207ApiService,
    FH000204ApiService
  ],
  declarations: [
    MatmBackPageComponent
    // ---------------- Pages Start ---------------- //
  ]
})
export class MatmBackModule { }
