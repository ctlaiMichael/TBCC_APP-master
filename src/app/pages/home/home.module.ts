import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { EffectCubeModule } from '@shared/layout/effect-cube/effect-cube.module';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '@shared/shared.module';
import { TopBoxModule } from '@shared/layout/top-box/top-box.module';
import { Fb000503ApiService } from '@api/fb/fb000503/fb000503-api.service';
import { BannerService } from './shared/service/banner.service';


@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    TopBoxModule,
    EffectCubeModule
  ],
  providers: [
    Fb000503ApiService,
    BannerService
  ],
  declarations: [
    HomePageComponent
  ]
})
export class HomeModule { }
