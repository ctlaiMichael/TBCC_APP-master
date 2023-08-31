import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSearchA11yPageComponent } from './account-search-a11y-page/account-search-a11y-page.component';
/** 
 * 台幣存款查詢
 */
import { TaiwanDepositA11yPageComponent } from './taiwan-deposit-a11y-page/taiwan-deposit-a11y-page.component';
import { SearchA11yPageComponent } from './taiwan-deposit-a11y-page/search-a11y-page/search-a11y-page.component';
import { DetailA11yPageComponent } from './taiwan-deposit-a11y-page/detail-a11y-page/detail-a11y-page.component';
import { MoreDetailA11yPageComponent } from './taiwan-deposit-a11y-page/more-detail-a11y-page/more-detail-a11y-page.component';
/**
 * 外匯存款查詢
 */
import { ForeignDepositA11yPageComponent } from './foreign-deposit-a11y-page/foreign-deposit-a11y-page.component';
import { ForeignSearchA11yPageComponent } from './foreign-deposit-a11y-page/foreign-search-a11y-page/foreign-search-a11y-page.component';
import { ForeignDetailA11yPageComponent } from './foreign-deposit-a11y-page/foreign-detail-a11y-page/foreign-detail-a11y-page.component';
import { ForeignMoreDetailA11yPageComponent } from './foreign-deposit-a11y-page/foreign-more-detail-a11y-page/foreign-more-detail-a11y-page.component';
const routes: Routes = [
   { path: '', redirectTo: 'a11yaccountkey', pathMatch: 'full' },{
    path: 'a11yaccountkey',                       // 設定根目錄為這一層
    component: AccountSearchA11yPageComponent
 },{
    path: 'a11ytaiwandepositkey',                 // 台幣存款查詢-列表
    component: TaiwanDepositA11yPageComponent
  },{
    path: 'a11ytaiwandepositsearchkey',           // 台幣存款查詢-查詢
    component: SearchA11yPageComponent,
  },{
    path: 'a11ytaiwandepositdetailkey',           // 台幣存款查詢-交易明細
    component: DetailA11yPageComponent,
  },{
    path: 'a11ytaiwandepositmoredetailkey',       // 台幣存款查詢-更多餘額查詢
    component: MoreDetailA11yPageComponent,
  },{
    path: 'a11yforeigndepositkey',                // 外匯存款查詢-列表
    component: ForeignDepositA11yPageComponent
  },{
    path: 'a11yforeigndepositsearchkey',          // 外匯存款查詢-查詢
    component: ForeignSearchA11yPageComponent,
  },{
    path: 'a11yforeigndepositdetailkey',          // 外匯存款查詢-交易明細
    component: ForeignDetailA11yPageComponent,
  },{
    path: 'a11yforeigndepositmoredetailkey',       // 外匯存款查詢-更多餘額查詢
    component: ForeignMoreDetailA11yPageComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSearchRoutingModule { }
