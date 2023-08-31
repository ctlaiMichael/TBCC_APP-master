import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { microInteractionComponent } from './micro-interaction.component';
import { microInteractionRoutingModule } from './micro-interaction-routing.module';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    microInteractionRoutingModule,
    SharedModule
  ],
  providers: [],
  exports: [microInteractionComponent],
  declarations: [microInteractionComponent]
})

// tslint:disable-next-line: class-name
export class microInteractionModule { }
