import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { PayVaCardComponent } from './pay-va-card/pay-va-card.component';
import { PayMarketCardComponent } from './pay-market-card/pay-market-card.component';

const routes: Routes = [
  {
    // == 繳本人合庫卡(編輯) == //
    path: 'pay-va-card', component: PayVaCardComponent
    // ,canActivate: [LogoutRequired]
  }
  ,
   {
    // == 繳本人合庫卡(編輯) == //
    path: 'pay-market-card', component: PayMarketCardComponent
    // ,canActivate: [LogoutRequired]
   }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardPayRoutingModule { }
