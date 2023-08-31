import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyloadRoutingModule } from './lazyload-routing.module';
import { LazyloadPageComponent } from './lazyload-page/lazyload-page.component';
import { Lazyload2PageComponent } from './lazyload2-page/lazyload2-page.component';
import { AlertModule } from '@shared/popup/alert/alert.module';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  imports: [
    SharedModule,
    AlertModule,
    LazyloadRoutingModule,
  ],
  declarations: [LazyloadPageComponent, Lazyload2PageComponent]
})
export class LazyloadModule { }
