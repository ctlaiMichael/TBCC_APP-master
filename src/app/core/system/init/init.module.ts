import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitService } from '@core/system/init/init.service';
import { TrustedDeviceService } from '@lib/plugins/trusted-device.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { F1000103ApiService } from '@api/f1/f1000103/f1000103-api.service';
import { Fb000601ApiService } from '@api/fb/fb000601/fb000601-api.service';
import { UrlSchemeHandlerService } from './url-scheme-handler.service';



@NgModule({
  imports: [CommonModule],
  providers: [
    InitService,
    UrlSchemeHandlerService,
    F1000103ApiService,
    Fb000601ApiService,
    TrustedDeviceService,
    CertService,
  ],
  declarations: [  ]
})
export class InitModule {}
