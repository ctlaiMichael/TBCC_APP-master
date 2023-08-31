import { NgModule } from '@angular/core';
import { FixedReleaseRoutingModule } from './fixed-release-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { FixedReleasePageComponent } from './fixed-release-page.component';


// ---------------- API Start ---------------- //
import { F6000201ApiService } from '@api/f6/f6000201/f6000201-api.service';
import { F6000202ApiService } from '@api/f6/f6000202/f6000202-api.service';

// ---------------- Service Start ---------------- //
import { InfomationModule } from '@shared/popup/infomation/infomation.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FixedReleaseService } from '../shared/service/fixed-release.service';
import { FixedReleaseConfirmComponent } from './fixed-release-confirm-page.component';
import { FixedReleaseResultComponent } from './fixed-release-result-page.component';



@NgModule({
    imports: [
        SharedModule
        , FixedReleaseRoutingModule
        , InfomationModule
        , SelectSecurityModule
        , CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        HandleErrorService,
        FixedReleaseService,
        F6000201ApiService,
        F6000202ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        FixedReleasePageComponent,
        FixedReleaseConfirmComponent,
        FixedReleaseResultComponent
    ],

})
export class FixedReleaseModule { }
