import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { InputCertProtectPwdComponent } from './input-cert-protect-pwd.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { InputCertProtectPwdService } from './input-cert-protect-pwd.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    TranslateModule,
    CommonModule
  ],
  declarations: [InputCertProtectPwdComponent],
  providers: [
    InputCertProtectPwdService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    InputCertProtectPwdComponent
  ]
})
export class InputCertProtectPwdModule { }
