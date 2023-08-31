/**
 * date popup
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { DatepickerPopComponent } from './datepicker-pop.component';
import { DatepickerPopService } from './datepicker-pop.service';
import { MonthNameDatepickerPipe } from './datepicker-pop.pipe';
// == 其他template清單 == //
const PipeList = [
  MonthNameDatepickerPipe
];
const TemplateList = [
  DatepickerPopComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule
  ],
  exports: [
    ...PipeList,
    ...TemplateList
  ],
  declarations: [
    ...PipeList,
    ...TemplateList
  ],
  providers: [
    DatepickerPopService
  ],
  entryComponents: [
    ...TemplateList
  ]
})
export class DatepickerPopComponentModule { }
