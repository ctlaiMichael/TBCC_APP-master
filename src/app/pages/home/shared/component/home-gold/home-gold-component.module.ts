/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
// ---------------- Model Start ---------------- //
// ---------------- API Start ---------------- //
import { FB000701ApiService } from '@api/fb/fb000701/fb000701-api.service';
import { FB000702ApiService } from '@api/fb/fb000702/fb000702-api.service';
// ---------------- Shared Start ---------------- //
import { GoldService } from '@pages/financial/shared/service/gold.service';
import { HomeGoldComponent } from './home-gold.component';

// == 其他template清單 == //
const Provider = [
  FB000701ApiService
  , FB000702ApiService
  , GoldService
];
const TemplateList = [
  HomeGoldComponent
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
    ...Provider
  ]
})
export class HomeGoldComponentModule { }
