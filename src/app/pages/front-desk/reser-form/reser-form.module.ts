import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReserFormRoutingModule } from './reser-form-routing.module';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReserFormRoutingModule,
  ],
  declarations: [MenuPageComponent]
})
export class ReserFormModule { }
