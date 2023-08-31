/**
 * 線上申貸
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { OnlineLoanDeskRoutingModule } from './online-loan-desk-routing.module';
// == 其他template清單 == //
import { OnlineLoanDeskPageComponent } from './online-loan-desk-page.component';
const TemplateList = [
  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    OnlineLoanDeskRoutingModule
  ],
  exports: [
  ],
  declarations: [
    OnlineLoanDeskPageComponent
  ],
  providers: [
  ]
})
export class OnlineLoanDeskModule { }
