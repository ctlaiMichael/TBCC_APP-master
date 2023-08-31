/**
 * 約定條款-共用
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { OneProvisionComponent } from './one-provision.component';
// == 其他template清單 == //
const TemplateList = [
  OneProvisionComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule
  ],
  exports: [
    OneProvisionComponent
  ],
  declarations: [
    OneProvisionComponent
  ],
  providers: [
  ]
})
export class OneProvisionComponentModule { }
