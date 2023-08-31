import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CardSafePopUpComponent } from './card-safe-popup.component';
import { CardSafePopupService } from './card-safe-popup.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
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
    CardSafePopUpComponent
  ],
  providers: [
    CardSafePopupService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    CardSafePopUpComponent
  ]
})
export class CardSafePopUpModule { }
