import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontDeskRoutingModule } from './front-desk-routing.module';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FrontDeskRoutingModule,
    MenuTempModule
  ],
  declarations: [MenuPageComponent]
})
export class FrontDeskModule { }
