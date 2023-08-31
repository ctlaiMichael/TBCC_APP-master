import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBoxComponent } from './top-box.component';
import { TranslateModule } from '@ngx-translate/core';

const COMPONENT = [
  TopBoxComponent
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    ...COMPONENT
  ],
  exports: [
    ...COMPONENT
  ]
})
export class TopBoxModule { }
