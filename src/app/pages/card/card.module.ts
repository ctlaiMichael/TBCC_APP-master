import { NgModule } from '@angular/core';
import { CardRoutingModule } from './card-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { CardHomeComponent } from './card-home/card-home.component';
// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { CardMenuServiceModule } from './shared/service/card-menu/card-menu-service.module';


@NgModule({
  imports: [
    SharedModule
    , CardRoutingModule
    , CardMenuServiceModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    CardHomeComponent,
  ]
})
export class CardModule { }
