import { NgModule } from '@angular/core';
import { InsuranceRoutingModule } from './insurance-routing.module';

import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { InsuranceEditPageComponent } from './edit/insurance-edit-page.component';
// import { InsuranceConfirmPageComponent } from './confirm/insurance-confirm-page.component';
// import { InsuranceResulComponent } from './result/insurance-result-page.component';


// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //





@NgModule({
  imports: [
    SharedModule
    , InsuranceRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    InsuranceEditPageComponent
    // , InsuranceConfirmPageComponent
    // , InsuranceResulComponent
  ],

})
export class InsuranceModule { }
