/**
 * Route定義
 * 信託業務推介
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundNetworkComponent } from './fund-network.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 信託業務推介列表
    {path: 'list', component: FundNetworkComponent, data: {}}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FundNetworkRoutingModule {
    constructor(
    ) {
    }
}
