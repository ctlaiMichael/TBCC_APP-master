import { NgModule } from '@angular/core';
import { NtuhRoutingModule } from './ntuh-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HaspayQueryModule } from '../haspay-query/haspay-query.module';
import { AccountSetModule } from '../account-set/account-set.module';
import { QrCodeSaveModule } from './qr-code-save/qr-code-save.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
// ---------------- Pages Start ---------------- //
import { NtuhMenuPageComponent } from './ntuh-menu/ntuh-menu-page.component';
import { NtuhPayComponent } from './ntuh-pay/ntuh-pay-page.component';
import { NtuhPayListComponent } from './ntuh-pay-list/ntuh-paylist-page.component';
import { NtuhConfirmPageComponent } from './ntuh-confirm/ntuh-confirm-page.component';
import { NtuhResultPageComponent } from './ntuh-result/ntuh-result-page.component';
// ---------------- API Start ---------------- //
import { FH000103ApiService } from '@api/fh/fh000103/fh000103-api.service';
import { FH000104ApiService } from '@api/fh/fh000104/fh000104-api.service';
import { QRCodeModule } from 'angular2-qrcode';
import { UserSetCertifyModule } from '@pages/user-set/shared/component/popup/certify.module';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    NtuhRoutingModule,
    HaspayQueryModule,
    AccountSetModule,
    QrCodeSaveModule,
    QRCodeModule,
    SelectSecurityModule,
    CheckSecurityModule,
    UserSetCertifyModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FH000103ApiService,
    FH000104ApiService,
    // SqlitePluginService
  ],
  exports:[

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    NtuhMenuPageComponent,
    NtuhPayComponent,
    NtuhPayListComponent,
    NtuhConfirmPageComponent,
    NtuhResultPageComponent,
  ]
})
export class NtuhModule { }
