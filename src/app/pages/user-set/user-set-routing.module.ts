import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSetComponent } from './user-set.component';
import { LoginRequired } from '@core/auth/login-required.service';

// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  , {
    path: 'menu', component: UserSetComponent
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired] // 讓使用者可以看到選單
  }
  , {
    path: 'netCodeChg', loadChildren: './netcode-change/netcode-change.module#NetCodeChgModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'netPwdChg', loadChildren: './netpswd-change/netpswd-change.module#NetPswdChgModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'mailChg', loadChildren: './email-change/email-change.module#EmailChangeModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'addressChg', loadChildren: './address-change/address-change.module#AddressChangeModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'commonAccount', loadChildren: './common-account/common-account.module#CommonAccountModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'agreedAccount', loadChildren: './agreed-account/agreed-account.module#AgreedAccountModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'sslChg', loadChildren: './ssl-change/ssl-change.module#SSLChgModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'statementMenu', loadChildren: './statement-change/statement-change.module#StatementModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , {
    path: 'commonMarket', loadChildren: './common-market/common-market.module#CommonMarketModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
  , { path: 'lost-report', loadChildren: './lost-report/lost-report.module#LostReportModule' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSetRoutingModule { }
