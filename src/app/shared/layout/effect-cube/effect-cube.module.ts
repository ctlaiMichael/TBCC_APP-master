import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectCubeComponent } from './effect-cube.component';

const COMPONENT = [
  EffectCubeComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...COMPONENT
  ],
  exports: [
    ...COMPONENT
  ]
})
export class EffectCubeModule { }
