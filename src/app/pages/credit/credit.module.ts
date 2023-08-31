import { NgModule } from '@angular/core';
import { CreditRoutingModule } from './credit-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CreditMenuComponent } from './credit-menu/credit-menu-page.component';
import { FormsModule } from '@angular/forms';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';

// ---------------- Pages Start ---------------- //



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule
    , CreditRoutingModule
    , CreditRoutingModule
    , FormsModule
    , MenuTempModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    CreditMenuComponent

  ]
})
export class CreditModule { }
