/**
 * Route定義
 * DEMO (若大功能子層太多，可增加資料夾管理)
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
// import { Logger } from '@hitrust/logger.service';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import * as APP_ROUTE_SET from '@route_set/app-routing.set';
import { GoldBusinessSharedModule } from '@pages/gold-business/shared/gold-business-shared.module';
// ==Component: 欲使用的component== //
import { TransactionDetailListComponent } from 'app/pages/gold-business/transaction-detail/transaction-detail-list.component';
import {CheckActivationService} from '@pages/gold-business/shared/service/check-activation.service';
import {ActivationStatementComponent} from 'app/pages/gold-business/activation/activation-statement.component';
// import {CertifyComponent} from 'app/component/gold-business/share/certify.component';
// import {ResultComponent} from 'app/component/gold-business/share/result.component';

// ==Service: 欲使用的service== //
//
// 啟動交易狀態電文
import { FB000703ApiService } from 'app/api/fb/fb000703/fb000703-api.service';
import { FB000704ApiService } from 'app/api/fb/fb000704/fb000704-api.service';
// ==Telegram: 欲使用的service== //


// == Route 設定 == //
const route_setting: Routes = [
    // -------------------------------- LazyLoad START -------------------------------- //
    {path: 'list', component: TransactionDetailListComponent, data: {}},
    // -------------------------------- LazyLoad End -------------------------------- //
];

// -------------------------------- 其他設定 END -------------------------------- //







const ROUTE: ModuleWithProviders = RouterModule.forChild(route_setting);
@NgModule({
    imports: [
        ROUTE,
        // APP_ROUTE_SET.importList, // 共用載入
        GoldBusinessSharedModule
    ],
    exports: [
        // RouterModule
    ],
    providers: [
        FB000704ApiService,
    ],
    declarations: [
        // == 請使用的component放此 == //
        TransactionDetailListComponent,
        // ActivationStatementComponent,
        // CertifyComponent,
        // ResultComponent,
    ]
})
export class GoldDetailClass {
    constructor(
    ) {
    }
}
