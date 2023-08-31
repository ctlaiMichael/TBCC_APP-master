/**
 * Route定義
 * OTP服務
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OtpServiceRoutingModule } from '@pages/security/otp-service/otp-service-routing.module';

// ---------------- Model Start ---------------- //
import { StepBarModule } from '@shared/template/stepbar/step-bar.module';
import { OneProvisionComponentModule } from '@shared/template/provision/one-provision/one-provision-component.module'; // 同意條款
import { PhoneTempComponentModule } from '@shared/template/text/phone-temp/phone-temp-component.module';
import { EmailTempComponentModule } from '@shared/template/text/email-temp/email-temp-component.module';
import { ResultTempModule } from '@shared/template/result/result-temp.module'; // 結果頁
// 安控
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //
import { OtpServicePageComponent } from '@pages/security/otp-service/otp-service-page.component';
// ---------------- Service Start ---------------- //
import { CertService } from '@lib/plugins/tcbb/cert.service'; // 憑證
// ---------------- API Start ---------------- //
import { F1000108ApiService } from '@api/f1/f1000108/f1000108-api.service';
// ---------------- Shared Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        OtpServiceRoutingModule
        , StepBarModule
        , OneProvisionComponentModule
        , PhoneTempComponentModule
        , EmailTempComponentModule
        , ResultTempModule
        // 安控
        , SelectSecurityModule
    ],
    providers: [
        F1000108ApiService
        , CertService
    ],
    declarations: [
        OtpServicePageComponent
    ]
})
export class OtpServiceModule {
    constructor(
    ) {
    }
}
