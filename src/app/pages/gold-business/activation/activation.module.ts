/**
 * Route定義
 * DEMO (若大功能子層太多，可增加資料夾管理)
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GoldBusinessActivationRoutingModule } from './activation-routing.module';
import { GoldBusinessSharedModule } from '@pages/gold-business/shared/gold-business-shared.module';
// ==Component: 欲使用的component== //
import { ActivationComponent } from '@pages//gold-business/activation/activation.component';
import {CheckActivationService} from '@pages/gold-business/shared/service/check-activation.service';
import { FB000703ApiService } from 'app/api/fb/fb000703/fb000703-api.service';
import { FB000704ApiService } from 'app/api/fb/fb000704/fb000704-api.service';
import {ActivationStatementComponent} from 'app/pages/gold-business/activation/activation-statement.component';
import { ActivationIdentityComponent } from '@pages//gold-business/activation/activation-identity.component';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
// ==Service: 欲使用的service== //

// ==Telegram: 欲使用的service== //

@NgModule({
    imports: [
        SharedModule,
        GoldBusinessActivationRoutingModule,
        GoldBusinessSharedModule,
        SelectSecurityModule,
        CheckSecurityModule,
    ],
    providers: [
        CheckActivationService,
        FB000703ApiService,
        FB000704ApiService
    ],
    declarations: [
        // == 請使用的component放此 == //
        ActivationComponent,
        ActivationStatementComponent,
        ActivationIdentityComponent,
    ]
})
export class GoldBusinessActiveModule {
    constructor(
    ) {
    }
}
