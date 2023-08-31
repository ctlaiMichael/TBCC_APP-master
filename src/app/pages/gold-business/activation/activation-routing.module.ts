/**
 * Route定義
 * DEMO (若大功能子層太多，可增加資料夾管理)
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivationComponent } from 'app/pages/gold-business/activation/activation.component';

// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'active', pathMatch: 'full' },
    // -------------------------------- LazyLoad START -------------------------------- //
    {path: 'active', component: ActivationComponent, data: {}},
    // -------------------------------- LazyLoad End -------------------------------- //
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [
    ],
})
export class GoldBusinessActivationRoutingModule {
    constructor(
    ) {
    }
}
