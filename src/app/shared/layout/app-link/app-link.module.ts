import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLinkDirective } from './app-link.directive';

const DIRECTIVES = [
  AppLinkDirective
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
export class AppLinkModule { }
