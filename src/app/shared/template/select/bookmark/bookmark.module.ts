/**
 * Select template Module
 * Menu
 * 滿版選單
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BookmarkComponent } from '@shared/template/select/bookmark/bookmark.component';
import { FormateModule } from '@shared/formate/formate.module';
import { BookmarkService } from './bookmark.service';

// == 其他template清單 == //
const TemplateList = [
  BookmarkComponent
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
  providers: [
    BookmarkService
  ]
})
export class BookmarkModule { }
