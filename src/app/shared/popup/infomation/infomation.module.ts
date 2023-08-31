/**
 * poput information
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { InfomationService } from './infomation.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfomationComponent } from './infomation.component';
import { FormateModule } from '@shared/formate/formate.module';

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , OverlayModule
    , TranslateModule
    , FormateModule
  ],
  declarations: [
    InfomationComponent
  ],
  providers: [
    InfomationService
  ],
  exports: [
    InfomationComponent
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    InfomationComponent
  ]
})
export class InfomationModule { }
