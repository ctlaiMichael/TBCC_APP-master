import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { AccountSetPageComponent } from '@pages/hospital/account-set/account-set-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  ,{
    // == 扣款(常用)帳號設定 == //
    path: 'account-set', component: AccountSetPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSetRoutingModule { }