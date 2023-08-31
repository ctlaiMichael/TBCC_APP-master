import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { AlertComponent } from './alert.component';
import { A11yAlertService } from './alert.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';  

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    CommonModule
  ],
  declarations: [
    AlertComponent
  ],
  providers: [
    A11yAlertService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    AlertComponent
  ]
})
export class A11yAlertModule { }
