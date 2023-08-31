/**
 * Route定義
 * DEMO (若大功能子層太多，可增加資料夾管理)
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// import { GoldBusinessRoutingActiveModule } from '@pages/gold-business/gold-business-share-routing.module';
// import * as APP_ROUTE_SET from '@route_set/app-routing.set';
// ==Component: 欲使用的component== //
import {CheckActivationService} from '@pages/gold-business/shared/service/check-activation.service';
// import {CertifyComponent} from '@pages/gold-business/shared/component/certify.component';
// import {ResultComponent} from '@pages/gold-business/shared/component/result.component';

// ==Service: 欲使用的service== //
//
// 啟動交易狀態電文
import { FB000703ApiService } from 'app/api/fb/fb000703/fb000703-api.service';
// ==Telegram: 欲使用的service== //

// == Route 設定 == //
// const route_setting: Routes = [
//     // -------------------------------- LazyLoad START -------------------------------- //
//     {path: 'active',component: ActivationComponent, data: {}},
//     // -------------------------------- LazyLoad End -------------------------------- //
// ];

// -------------------------------- 其他設定 END -------------------------------- //







// const ROUTE: ModuleWithProviders = RouterModule.forChild(route_setting);
@NgModule({
    imports: [
        // ROUTE,
        // APP_ROUTE_SET.importList, // 共用載入
    ],
    exports: [
    ],
    providers: [
        // FB000703ApiService,
        // CheckActivationService
    ],
    declarations: [
        // == 請使用的component放此 == //
        // CertifyComponent,
        // ResultComponent,
    ]
})
export class GoldBusinessSharedRoutingModule {
    constructor(
    ) {
    }
}
