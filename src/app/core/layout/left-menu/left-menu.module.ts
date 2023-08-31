import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftMenuService } from './left-menu.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    LeftMenuService
  ]
})
export class LeftMenuModule { }
