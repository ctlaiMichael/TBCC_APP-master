/**
 * Select template Module
 * Menu
 * 滿版選單
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MenuTempComponent } from '@shared/template/select/menu/menu-temp.component';
import { FormateModule } from '@shared/formate/formate.module';

// == 其他template清單 == //
const TemplateList = [
  MenuTempComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: []
})
export class MenuTempModule { }
