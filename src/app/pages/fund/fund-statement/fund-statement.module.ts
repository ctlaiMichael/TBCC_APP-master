import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FundStatementRoutingModule } from './fund-statement-routing.module';
import { FundStatementPageComponent } from './fund-statement-page.component';
import { FundStatementResultPageComponent } from './fund-statement-result-page.component';
import { FI000707ApiService } from '@api/fi/fi000707/fi000707-api.service';
import { FI000708ApiService } from '@api/fi/fi000708/fi000708-api.service';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

// ---------------- Pages Start ---------------- //



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SelectSecurityModule,
    CheckSecurityModule,
    SharedModule,
    FundStatementRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FI000707ApiService,
    FI000708ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    FundStatementPageComponent,
    FundStatementResultPageComponent
  ]
})
export class FundStatementModule { }
