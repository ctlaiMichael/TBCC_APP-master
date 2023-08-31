import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiContentDirective } from './ui-content.directive';
import { UiContentToDirective } from './ui-content-to.directive';

const DIRECTIVES = [
  UiContentDirective,
  UiContentToDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...DIRECTIVES
  ],
  exports: [
    ...DIRECTIVES
  ]
})
export class UiContentModule { }
