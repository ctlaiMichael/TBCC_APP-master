/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
// ---------------- Model Start ---------------- //
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
// ---------------- API Start ---------------- //
import { FB000201ApiService } from '@api/fb/fb000201/fb000201-api.service';
// ---------------- Shared Start ---------------- //
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { HomeForexRateComponent } from './home-forex-rate.component';

// == 其他template清單 == //
const Provider = [
  FB000201ApiService
  , ExchangeService
];
const TemplateList = [
  HomeForexRateComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    FlagFormateModule
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
export class HomeForexRateComponentModule { }
