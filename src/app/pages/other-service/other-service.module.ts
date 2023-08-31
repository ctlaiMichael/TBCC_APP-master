import { NgModule } from '@angular/core';
import { OtherServiceRoutingModule } from './other-service-routing.module';
import { SharedModule } from '@shared/shared.module';

import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
// ---------------- Pages Start ---------------- //
import { OtherMenuComponent } from './other-menu/other-menu.component';



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    OtherServiceRoutingModule
    , SharedModule
    , MenuTempModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    OtherMenuComponent
  ]
})
export class OtherServiceModule { }
