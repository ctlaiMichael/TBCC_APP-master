/**
 * 同意信託推介顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { EnterRecommendationComponent } from './enter-recommendation.component';
// == 其他template清單 == //
const TemplateList = [
  EnterRecommendationComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    EnterRecommendationComponent
  ],
  declarations: [
    EnterRecommendationComponent
  ],
  providers: [
  ]
})
export class EnterRecommendationComponentModule { }
