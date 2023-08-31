/**
 * 安控機制選項
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { a11yOtpSecurityComponent } from './a11y-otp-security.component';
import { A11yOtpSecurityService } from './a11y-otp-security.srevice';
import { F1000105ApiService } from '@api/f1/f1000105/f1000105-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

/**
 * 模組清單
 */
const Modules = [
  CommonModule,
  FormsModule,
  TranslateModule,
];
const Provider = [
  A11yOtpSecurityService,
  F1000105ApiService,
  HandleErrorService
];
const Component = [
  a11yOtpSecurityComponent
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
export class A11yOtpSecurityModule { }

