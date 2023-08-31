/**
 * Route定義
 * 信託業務推介
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundRecommendationComponent } from './fund-recommendation.component';
// import { DepositAccountContentComponent } from './content/deposit-account-content.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 信託業務推介列表
    {path: 'list', component: FundRecommendationComponent, data: {}}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FundRecommendationRoutingModule {
    constructor(
    ) {
    }
}
