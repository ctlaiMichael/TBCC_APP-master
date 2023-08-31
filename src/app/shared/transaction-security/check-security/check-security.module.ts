/**
 * 安控機制選項
 */
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { CheckSecurityService } from './check-security.srevice';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { CheckSecurityComponent } from './check-security.component';
import { CaModule } from '../ca-popup/ca.module';
import { OtpModule } from '../otp-popup/otp.module';
import { PatternModule } from '../pattern-popup/pattern.module';


/**
 * 模組清單
 */
const Modules = [
  CommonModule,
  FormsModule,
  TranslateModule,
  FormateModule,
  CaModule,
  OtpModule,
  PatternModule
];
const Provider = [
  CheckSecurityService,
  CertService
];
const Component = [
  CheckSecurityComponent
];

@NgModule({
  imports: [
    ...Modules
  ],
  providers: [
    ...Provider
  ],
  declarations: [
    ...Component
  ],
  exports: [
    ...Component
  ]
})
export class CheckSecurityModule { }
