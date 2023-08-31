/**
 * Route定義
 * 定期不定額查詢異動
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundPayChangeComponent } from './fund-pay-change.component';
// import { PayChangeContentComponent } from './content/pay-change-content.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 定期不定額查詢異動列表
    {path: 'list', component: FundPayChangeComponent, data: {}}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FundPayChangeRoutingModule {
    constructor(
    ) {
    }
}
