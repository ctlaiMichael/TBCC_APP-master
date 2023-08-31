import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OnlineLoanRoutingModule } from './online-loan-routing.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { OnlineLoanRequired } from './shared/policy/online-loan-required.service';

// ---------------- Pages Start ---------------- //
import { OnlineLoanMenuPageComponent } from './online-loan-menu-page.component';
// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    OnlineLoanRoutingModule,
    MenuTempModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    OnlineLoanRequired
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    OnlineLoanMenuPageComponent
  ]
})
export class OnlineLoanModule { }
