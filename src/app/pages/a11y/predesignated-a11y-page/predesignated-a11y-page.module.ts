import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredesignatedA11yPageRoutingModule } from './predesignated-a11y-page-routing.module';
import { PredesignatedTransferPageComponent } from './predesignated-transfer-page/predesignated-transfer-page.component';
import { PredesignatedConfirmPageComponent } from './predesignated-confirm-page/predesignated-confirm-page.component';
import { PredesignatedResultPageComponent } from './predesignated-result-page/predesignated-result-page.component';
import { SharedModule } from '@shared/shared.module';
//import { HomeMemuA11yPageComponent } from '../home-memu-a11y-page/home-memu-a11y-page.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    PredesignatedA11yPageRoutingModule
  ],
  declarations: [
    // PredesignatedA11yPageModule,
    // PredesignatedTransferPageComponent,
    PredesignatedConfirmPageComponent,
    PredesignatedResultPageComponent
  ]
})
export class PredesignatedA11yPageModule { }
