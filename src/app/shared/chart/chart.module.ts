/**
 * chart Module
 * 常用的chart圖e
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartComponent } from './chart.component';

// == 其他pipe清單 == //
const PipeList = [
  ChartComponent
];

@NgModule({
  imports: [
    CommonModule
    , FormsModule

  ],
  exports: [
    ...PipeList
  ],
  declarations: [
    ChartComponent
  ],
  providers: []
})
export class ChartModule { }
