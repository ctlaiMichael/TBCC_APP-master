/**
 * 9700 洗錢防制法資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { LaunderPreventionComponent } from './launder-prevention.component';
import { LaunderPreventionRoutingModule } from '@pages/front-desk/launder-prevention/launder-prevention.routing.module';
import { ResultTempModule } from '@shared/template/result/result-temp.module';
// == 其他template清單 == //
const TemplateList = [
  LaunderPreventionComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    LaunderPreventionRoutingModule,
    ResultTempModule
  ],
  exports: [
  ],
  declarations: [
    LaunderPreventionComponent
  ],
  providers: [
  ]
})
export class LaunderPreventionModule { }
