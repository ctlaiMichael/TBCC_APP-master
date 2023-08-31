import { NgModule } from '@angular/core';
import { QrCodeSaveRoutingModule } from './qr-code-save-routing.module';
import { SharedModule } from '@shared/shared.module';
import { QRCodeModule } from 'angular2-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
// ---------------- Pages Start ---------------- //
import { QrCodeSavePageComponent } from './qr-code-save.component';
// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { SqlitePluginService } from '@lib/plugins/sqlite/sqlite-plugin.service';

@NgModule({
  imports: [
    SharedModule,
    QrCodeSaveRoutingModule,
    NgxBarcodeModule,
    QRCodeModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    SqlitePluginService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    QrCodeSavePageComponent
  ]
})
export class QrCodeSaveModule { }
