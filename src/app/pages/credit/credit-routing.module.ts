import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditMenuComponent } from './credit-menu/credit-menu-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  {
    path: '', redirectTo: 'menu', pathMatch: 'full'
  }
  , {
    path: 'menu', component: CreditMenuComponent, data: {
      // className: 'FinancialComponent', functionId: 'FinancialMenu', headerTitle: 'FinancialComponent'
    }
  }
  , {
    path: 'inquiry', loadChildren: '@pages/credit/inquiry/inquiry.module#InquiryModule'
  }
  , {
    path: 'payment', loadChildren: '@pages/credit/payment/payment.module#PaymentModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditRoutingModule { }
