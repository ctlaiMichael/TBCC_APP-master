/**
 * 
 * 選擇銀行代碼
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MenuTempComponent } from '@shared/template/select/menu/menu-temp.component';
import { FormateModule } from '@shared/formate/formate.module';
import { SearchBankComponent } from './search-bank.component';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';

// == 其他template清單 == //
const TemplateList = [
  SearchBankComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
    F4000103ApiService
  ]
})
export class SearchBankModule { }
