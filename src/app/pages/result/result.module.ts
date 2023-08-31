import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultPageComponent } from './result-page/result-page.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ResultRoutingModule
  ],
  declarations: [ResultPageComponent]
})
export class ResultModule { }
