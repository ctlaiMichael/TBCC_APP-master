import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialInfoMenuComponent } from './financial-info-menu/financial-info-menu.component';
import { ForeignExchangeRateA11yPageComponent } from './foreign-exchange-rate-a11y-page/foreign-exchange-rate-a11y-page.component';
import { TaiwanDepositsRateA11yPageComponent } from './taiwan-deposits-rate-a11y-page/taiwan-deposits-rate-a11y-page.component';
import { TaiwanLoanRateA11yPageComponent } from './taiwan-loan-rate-a11y-page/taiwan-loan-rate-a11y-page.component';

import { ForeignLoanRateA11yPageComponent } from './foreign-loan-rate-a11y-page/foreign-loan-rate-a11y-page.component';
import { ForeignDepositsRateA11yPageComponent } from './foreign-deposits-rate-a11y-page/foreign-deposits-rate-a11y-page.component';
import { ForeignDepositsMoreRateA11yPageComponent } from './foreign-deposits-more-rate-a11y-page/foreign-deposits-more-rate-a11y-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'a11yfinancialinfokey', pathMatch: 'full' }, {
    path: 'a11yfinancialinfokey', // 設定根目錄為這一層
    component: FinancialInfoMenuComponent
  }
  , {
    path: 'a11yforeignexchangekey', // 設定根目錄為這一層
    component: ForeignExchangeRateA11yPageComponent
  }, {
    path: 'a11ytaiwndepositskey', // 設定根目錄為這一層
    component: TaiwanDepositsRateA11yPageComponent
  }, {
    path: 'a11ytaiwnloankey', // 設定根目錄為這一層
    component: TaiwanLoanRateA11yPageComponent
  }, {
    path: 'a11yforeigndepositskey', // 設定根目錄為這一層
    component: ForeignDepositsRateA11yPageComponent
  }, {
    path: 'a11yforeignloankey', // 設定根目錄為這一層
    component: ForeignLoanRateA11yPageComponent
  }, {
    path: 'a11yforeigndepositsmorekey', // 設定根目錄為這一層
    component: ForeignDepositsMoreRateA11yPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialInformationRoutingModule { }
