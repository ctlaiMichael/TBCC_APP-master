/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { PersonCapitalComponent } from './person-capital.component';
// == 其他template清單 == //
const TemplateList = [
  PersonCapitalComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    PersonCapitalComponent
  ],
  declarations: [
    PersonCapitalComponent
  ],
  providers: [
  ]
})
export class PersonCapitalModule { }
