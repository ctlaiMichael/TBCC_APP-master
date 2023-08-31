import { NgModule } from '@angular/core';
import { ConfirmComponent } from './confirm.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmService } from './confirm.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule
  ],
  declarations: [
    ConfirmComponent
  ],
  providers: [
    ConfirmService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    ConfirmComponent
  ]
})
export class ConfirmModule { }
