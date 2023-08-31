import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanRoutingModule } from './scan-routing.module';
import { ScanComponent } from './scan/scan.component';
import { QrcodeService } from '@lib/plugins/qrcode.service';
@NgModule({
  imports: [
    CommonModule,
    ScanRoutingModule,
  ],
  providers: [QrcodeService],
  exports: [ScanComponent],
  declarations: [ScanComponent]
})
export class ScanModule { }
