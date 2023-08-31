import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';
const COMPONENT = [
  MapComponent
];
@NgModule({
  imports: [
    CommonModule,
    //  AgmCoreModule.forRoot({
    //    apiKey: '',
    //    language: 'zh-TW'
    //  })
  ],
  declarations: [
    ...COMPONENT
  ],
  exports: [
    ...COMPONENT
  ]
})
export class MapModule { }
