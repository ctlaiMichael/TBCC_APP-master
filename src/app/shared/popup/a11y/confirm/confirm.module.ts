import { NgModule } from '@angular/core';
import { ConfirmComponent } from './confirm.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yConfirmService } from './confirm.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';  
@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    CommonModule
  ],
  declarations: [
    ConfirmComponent
  ],
  providers: [
    A11yConfirmService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    ConfirmComponent
  ]
})
export class A11yConfirmModule { }
