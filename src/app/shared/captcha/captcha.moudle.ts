
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaptchaComponent } from './captcha.component';
import { CaptchaService } from './captcha.service';

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , TranslateModule
  ],
  declarations: [
    CaptchaComponent
  ],
  exports: [
    CaptchaComponent
  ],
  providers: [
    CaptchaService
  ]
})
export class CaptchaModule {

}

