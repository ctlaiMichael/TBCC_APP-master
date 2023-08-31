import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CaptchaModule } from '@shared/captcha/captcha.moudle.ts';
import { FC001009ApiService } from '@api/fc/fc001009/fc001009-api.service';
import { FC001010ApiService } from '@api/fc/fc001010/fc001010-api.service';
import { SmsComponent } from './sms.component';
import { SmsService } from './sms.service';


@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    CaptchaModule
  ],
  declarations: [
    SmsComponent
  ],
  providers: [
    FC001009ApiService,
    FC001010ApiService,
    SmsService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    SmsComponent
  ]
})
export class SmsModule { }
