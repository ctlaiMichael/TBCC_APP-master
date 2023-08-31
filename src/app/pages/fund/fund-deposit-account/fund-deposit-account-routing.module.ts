/**
 * Route定義
 * 現金收益存入帳號異動
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundDepositAccountComponent } from './fund-deposit-account.component';
// import { DepositAccountContentComponent } from './content/deposit-account-content.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 現金收益存入帳號異動列表
    {path: 'list', component: FundDepositAccountComponent, data: {}}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FundDepositAccountRoutingModule {
    constructor(
    ) {
    }
}
