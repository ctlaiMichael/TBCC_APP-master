import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpComponent } from './otp.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { OtpService } from './otp.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { F1000105ApiService } from '@api/f1/f1000105/f1000105-api.service';
import { CaptchaModule } from '@shared/captcha/captcha.moudle.ts';
@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    CaptchaModule
  ],
  declarations: [
    OtpComponent
  ],
  providers: [
    OtpService,
    F1000105ApiService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    OtpComponent
  ]
})
export class OtpModule { }
