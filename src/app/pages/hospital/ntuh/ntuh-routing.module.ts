import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { NtuhMenuPageComponent } from '@pages/hospital/ntuh/ntuh-menu/ntuh-menu-page.component';
import { NtuhPayComponent } from '@pages/hospital/ntuh/ntuh-pay/ntuh-pay-page.component';
import { NtuhPayListComponent } from './ntuh-pay-list/ntuh-paylist-page.component';
import { NtuhConfirmPageComponent } from './ntuh-confirm/ntuh-confirm-page.component';
import { NtuhResultPageComponent } from './ntuh-result/ntuh-result-page.component';
import { LoginRequired } from '@core/auth/login-required.service';

const routes: Routes = [
  { path: '', redirectTo: 'ntuh-menu', pathMatch: 'full' }
  , {
    // == 台大繳費選單 == //
    path: 'ntuh-menu', component: NtuhMenuPageComponent
    // ,canActivate: [LoginRequired]
  }
  , {
    // == 台大繳費(本人，非本人) == //
    path: 'ntuh-pay', component: NtuhPayComponent
    ,canActivate: [LoginRequired]
  }
  , {
    // == 台大繳費(醫療費清單) == //
    path: 'ntuh-paylist', component: NtuhPayListComponent
    ,canActivate: [LoginRequired]
  }
  , {
    // == 台大繳費(繳費確認) == //
    path: 'ntuh-confirm', component: NtuhConfirmPageComponent
    ,canActivate: [LoginRequired]
  }
  , {
    // == 台大繳費(繳費確認) == //
    path: 'ntuh-result', component: NtuhResultPageComponent
    ,canActivate: [LoginRequired]
  }
  , {
    // == 服務條碼儲存區 == //
    path: 'qr-code-save', loadChildren: './qr-code-save/qr-code-save.module#QrCodeSaveModule'
    // ,canActivate: [LoginRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NtuhRoutingModule { }