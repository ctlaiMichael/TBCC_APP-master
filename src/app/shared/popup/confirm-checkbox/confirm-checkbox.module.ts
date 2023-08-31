import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmCheckBoxComponent } from './confirm-checkbox.component';
import { ConfirmCheckBoxService } from './confirm-checkbox.service';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    FormsModule

  ],
  declarations: [
    ConfirmCheckBoxComponent
  ],
  providers: [
    ConfirmCheckBoxService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    ConfirmCheckBoxComponent
  ]
})
export class ConfirmCheckBoxModule { }
