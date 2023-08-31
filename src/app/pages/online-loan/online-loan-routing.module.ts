import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { OnlineLoanMenuPageComponent } from './online-loan-menu-page.component';
import { LoginRequired } from '@core/auth/login-required.service';
import { OnlineLoanRequired } from './shared/policy/online-loan-required.service';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: OnlineLoanMenuPageComponent },
  {
    // == 線上申請房貸增貸 == //
    path: 'mortgage-increase', loadChildren: './mortgage-increase/mortgage-increase.module#MortgageIncreaseModule'
    , canActivate: [LoginRequired]
    // , canActivate: [OnlineLoanRequired]
    , data: {
      preload: false
    }
  },
  {
    // == 線上申請信用貸款 == //
    path: 'credit-loan', loadChildren: './credit-loan/credit-loan.module#CreditLoanModule'
    , canActivate: [LoginRequired]
    // , canActivate: [OnlineLoanRequired]
    , data: {
      preload: false
    }
  },
  {
    // == 申請文件上傳 == //
    path: 'main-upload', loadChildren: './main-upload/main-upload.module#MainUploadModule'
    , canActivate: [LoginRequired]
    , data: {
      preload: false
    }
  },

  {
    // == 申請進度查詢 == //
    path: 'schedule-query', loadChildren: './schedule-query/schedule-query.module#ScheduleQueryModule'
    , canActivate: [LoginRequired]
    , data: {
      preload: false
    }
  },

  {
    // == 線上簽約對保 == //
    path: 'sign-protection', loadChildren: './sign-protection/sign-protection.module#SignProtectionModule'
    , canActivate: [LoginRequired
      // , OnlineLoanRequired
    ]
    , data: {
      preload: false
    }
  },
  {
    // == 線上約據下載 == //
    path: 'contract-download', loadChildren: './contract-download/contract-download.module#ContractDownloadModule'
    , canActivate: [LoginRequired]
    , data: {
      preload: false
    }
  }
  , {
    // == 線上申請信用貸款(預填單) == //
    path: 'credit-resver-loan', loadChildren: './credit-resver-loan/credit-resver-loan.module#CreditResverLoanModule'
    //有差異(有些功能不能用) , canActivate: [LoginRequired]
  }
  , {
    // == 線上申請房屋貸款(預填單) == //
    path: 'house-loan', loadChildren: './house-loan/house-loan.module#HouseLoanModule'
    //有差異(有些功能不能用) , canActivate: [LoginRequired]
  }
  , {
    // == 勞工紓困方案 20200502 == //
    path: 'bail-out-loan', loadChildren: './bail-out-loan/bail-out-loan.module#BailOutLoanModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineLoanRoutingModule { }
