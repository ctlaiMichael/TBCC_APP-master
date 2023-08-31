import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule
  ],
  declarations: [
    AlertComponent
  ],
  providers: [
    AlertService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    AlertComponent
  ]
})
export class AlertModule { }
