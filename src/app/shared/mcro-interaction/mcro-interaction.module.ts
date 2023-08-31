import { NgModule } from '@angular/core';
import { mcroInteractionComponent } from './mcro-interaction.component';
import { mcroInteractionRoutingModule } from './mcro-interaction-routing.module'
// == 其他pipe清單 == //
const PipeList = [
  mcroInteractionComponent
];

@NgModule({
  imports: [
    mcroInteractionRoutingModule
  ],
  exports: [
    ...PipeList
  ],
  declarations: [
    mcroInteractionComponent
  ],
  providers: []
})
// tslint:disable-next-line: class-name
export class mcroInteractionModule { }
