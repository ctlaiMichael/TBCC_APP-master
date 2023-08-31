import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSelectComponent } from './date-select.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DateSelectService } from './date-select.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , OverlayModule
    , TranslateModule
  ],
  exports: [
    DateSelectComponent
  ],
  declarations: [
    DateSelectComponent
  ],
  providers: [
    DateSelectService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    DateSelectComponent
  ]
})
export class DateSelectModule { }
