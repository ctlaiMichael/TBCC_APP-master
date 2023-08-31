import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ElectricityRoutingModule } from './electricity-routing.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';

// ---------------- Pages Start ---------------- //
import { ElectricityPageComponent } from './electricity-page.component';
import { ElectricityConfirmPageComponent } from './electricity-confirm-page.component';
import { ElectricityResultPageComponent } from './electricity-result-page.component';

// ---------------- API Start ---------------- //
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7000301ApiService } from '@api/f7/f7000301/f7000301-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    ElectricityRoutingModule,
    SelectSecurityModule,
    CheckSecurityModule,
    AccountMaskModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F7000104ApiService,
    F7000301ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    ElectricityPageComponent,
    ElectricityConfirmPageComponent,
    ElectricityResultPageComponent
  ]
})
export class ElectricityModule {}
