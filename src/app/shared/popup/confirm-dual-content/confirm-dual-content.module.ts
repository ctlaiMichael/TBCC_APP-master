import { NgModule } from '@angular/core';
import { ConfirmDualContentComponent } from './confirm-dual-content.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmDualContentService } from './confirm-dual-content.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule
  ],
  declarations: [
    ConfirmDualContentComponent
  ],
  providers: [
    ConfirmDualContentService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    ConfirmDualContentComponent
  ]
})
export class ConfirmDualContentModule { }
