import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForeignExchangeComponent } from './menu/foreign-exchange-page.component';

// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  // == 外匯業務選單 == //
  , {
    path: 'menu', component: ForeignExchangeComponent
  }
  , {
    // 外幣存款查詢
    path: 'deposit', loadChildren: './foreign-deposit/foreign-deposit.module#ForeignDepositModule'
    // ,canActivate: [LogoutRequired]
  }
  // 台幣轉外幣
  , {
    path: 'twd-to-foreign', loadChildren: './twd-to-foreign/twd-to-foreign.module#TwdToForeignModule'
  }
  // 外幣轉台幣
  , {
    path: 'foreign-to-twd', loadChildren: './foreign-to-twd/foreign-to-twd.module#ForeignToTwdModule'
  }
  // 外幣存款轉帳
//   , {
//     path: 'foreign-transfer', loadChildren: './transfer/foreign-transfer.module#ForeignTransferModule'
//   }
  , {
      path: 'foreign-to-foreign', loadChildren: './foreign-to-foreign/foreign-to-foreign.module#ForeignToForeignModule'
  }
  // , {
  //   path: 'demand-to-time', component: DemandToTimePageComponent, data: {
  //   }
  // }
  // 綜定存轉綜活存
  , {
    path: 'demand-to-time', loadChildren: './demand-to-time-deposit/demand-to-time.module#DemandToTimeModule'
  }
  // 綜活存中途解約
  , {
    path: 'time-deposit-terminate', loadChildren: './time-deposit-terminate/time-deposit-terminate.module#TimeDepositTerminateModule'
  }
  // 預約外幣轉帳查詢
  , {
    path: 'reservation-inquiry', loadChildren: './reservation-inquiry/reservation-inquiry.module#ReservationInquiryModule'
  }
  // 外幣繳保費
  // , {
  //   path: 'insurance', loadChildren: './insurance/insurance.module#InsuranceModule'
  // }
    , {
    path: 'foreign-insurance-pay', loadChildren: './foreign-insurance-pay/foreign-insurance-pay.module#ForeignInsurancePayModule'
  }
  // 累計結匯查詢
  , {
    path: 'personal-quota', loadChildren: './personal-quota/personal-quota.module#PersonalQuotaModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignExchangeRoutingModule { }
