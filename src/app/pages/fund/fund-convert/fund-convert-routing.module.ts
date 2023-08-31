/**
 * Route定義
 * 基金轉換
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundConvertComponent } from './fund-convert.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 基金轉換列表
    {path: 'list', component: FundConvertComponent, data: {}}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FundConvertRoutingModule {
    constructor(
    ) {
    }
}
