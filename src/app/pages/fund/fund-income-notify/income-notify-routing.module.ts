/**
 * Route定義
 * 停損獲利點通知
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncomeNotifyComponent } from './income-notify.component';
// import { DepositAccountContentComponent } from './content/deposit-account-content.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 停損獲利點通知列表
    {path: 'list', component: IncomeNotifyComponent, data: {}}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IncomeNotifyRoutingModule {
    constructor(
    ) {
    }
}
