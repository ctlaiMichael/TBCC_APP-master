import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CaComponent } from './ca.component';
import { CaService } from './ca.service';
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
    CaComponent
  ],
  providers: [
    CaService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    CaComponent
  ]
})
export class CaModule { }
