import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialComponent } from './financial.component';
// import { BondRatePageComponent } from './bond-rate/bond-rate-page.component';
// import { GoldPageComponent } from './gold/gold-page.component';
// import { ExchangePageComponent } from './exchange/exchange-page.component';
// import { TwdSavePageComponent } from './twd-save/twd-save-page.component';
// import { TwdLoanPageComponent } from './twd-loan/twd-loan-page.component';
// import { ForeignSavePageComponent } from './foreign-save/foreign-save-page.component';
// import { ForeignLoanPageComponent } from './foreign-loan/foreign-loan-page.component';
// import { ForeignSaveDetailPageComponent } from './foreign-save/foreign-save-detail-page.component';
// import { TicketRatePageComponent } from './ticket-rate/ticket-rate-page.component';
// import { ExchangeCalculatePageComponent } from './exchange/exchange-calculate-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: 'menu', component: FinancialComponent },
  // 黃金牌價
  {
    path: 'goldPrice', loadChildren: './gold/gold-price.module#GoldPriceModule'
    , data: {
      preload: true
    }
  },
  // 外幣匯率
  {
    path: 'exchange', loadChildren: './exchange/exchange.module#ExchangeModule'
    , data: {
      preload: true
    }
  },
  // 台幣存款利率
  // { path: 'twdSave', component: TwdSavePageComponent },
  {
    path: 'twdSave', loadChildren: './twd-save/twd-save-page.module#TwdSavePageModule'
    , data: {
      preload: false
    }
  },
  // 台幣放款利率
  // { path: 'twdLoan', component: TwdLoanPageComponent },
  {
    path: 'twdLoan', loadChildren: './twd-loan/twd-loan-page.module#TwdLoanPageModule'
    , data: {
      preload: false
    }
  },
  // 外幣存款利率
  // { path: 'foreignSave', component: ForeignSavePageComponent },
  // { path: 'foreignSaveDetail', component: ForeignSaveDetailPageComponent },
  {
    path: 'foreignSave', loadChildren: './foreign-save/foreign-save.module#ForeignSaveModule'
    , data: {
      preload: false
    }
  },
  // 外幣放款利率
  // { path: 'foreignLoan', component: ForeignLoanPageComponent },
  {
    path: 'foreignLoan', loadChildren: './foreign-loan/foreign-loan-page.module#ForeignLoanPageModule'
    , data: {
      preload: false
    }
  },
  // 債券利率
  // { path: 'bondRate', component: BondRatePageComponent },
  {
    path: 'bondRate', loadChildren: './bond-rate/bond-rate-page.module#BondRatePageModule'
    , data: {
      preload: false
    }
  },
  // 票券利率
  // { path: 'ticketRate', component: TicketRatePageComponent },
  {
    path: 'ticketRate', loadChildren: './ticket-rate/ticket-rate-page.module#TicketRatePageModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialRoutingModule { }
