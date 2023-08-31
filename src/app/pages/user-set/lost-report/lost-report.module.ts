import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { NgModule } from '@angular/core';
import { LostReportRoutingModule } from './lost-report.routing.module';
import { SharedModule } from '@shared/shared.module';
import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module'; // 網銀登入密碼
import { LostReportPageComponent } from './lost-report-page.component';
// ---------------- API Start ---------------- //
import { LostReportService } from '@pages/user-set/shared/service/lost-report.service';
import { FK000101ApiService } from '@api/fk/fk000101/fk000101-api.service';
import { FK000102ApiService } from '@api/fk/fk000102/fk000102-api.service';
import { FK000103ApiService } from '@api/fk/fk000103/fk000103-api.service';
import { UserSetResultModule } from '../shared/component/result/result.module';
// import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        // UserMaskModule, //遮罩
        LostReportRoutingModule,
        UserSetResultModule,
        CheckSecurityModule,
        LoginPswdComponentModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        LostReportService,
        FK000101ApiService,
        FK000102ApiService,
        FK000103ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        LostReportPageComponent
    ],
    exports: [
    ]
})
export class LostReportModule { }