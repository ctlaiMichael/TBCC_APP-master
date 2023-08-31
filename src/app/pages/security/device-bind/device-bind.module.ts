/**
 * Route定義
 * 裝置綁定
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DeviceBindRoutingModule } from '@pages/security/device-bind/device-bind-routing.module';

// ---------------- Model Start ---------------- //
import { StepBarModule } from '@shared/template/stepbar/step-bar.module'; // 步驟列
import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module'; // 網銀登入密碼
import { ResultTempModule } from '@shared/template/result/result-temp.module'; // 結果頁
// ---------------- Pages Start ---------------- //
import { DeviceBindPageComponent } from './device-bind-page.component';
import { DeviceBindSendPageComponent } from './device-bind-send/device-bind-send-page.component';
// ---------------- API Start ---------------- //
import { F1000106ApiService } from '@api/f1/f1000106/f1000106-api.service';
import { F1000107ApiService } from '@api/f1/f1000107/f1000107-api.service';
// ---------------- Service Start ---------------- //
import { DeviceBindService } from '@pages/security/shared/service/device-bind.service';
// ---------------- Shared Start ---------------- //

@NgModule({
    imports: [
        SharedModule
        , DeviceBindRoutingModule
        , StepBarModule
        , LoginPswdComponentModule
        , ResultTempModule
    ],
    providers: [
        F1000106ApiService,
        F1000107ApiService,
        DeviceBindService
    ],
    declarations: [
        DeviceBindPageComponent
        , DeviceBindSendPageComponent // 啟動
    ]
})
export class DeviceBindModule {
    constructor(
    ) {
    }
}
