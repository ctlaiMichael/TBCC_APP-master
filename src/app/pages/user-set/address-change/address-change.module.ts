import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { NgModule } from '@angular/core';
import { AddressChangeRoutingModule } from './address-change.routing.module';
import { SharedModule } from '@shared/shared.module';


import { AddressChgPageComponent } from './address-change-page.component';
import { ConfirmAddressPageComponent } from '@pages/user-set/address-change/confirm/confirm-address-page.component';


// ---------------- API Start ---------------- //


import { FF000101ApiService } from '@api/ff/ff000101/ff000101-api.service';
import { FF000102ApiService } from '@api/ff/ff000102/ff000102-api.service';
import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        AddressChangeRoutingModule,
        UserSetCertifyModule,
        UserSetResultModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FF000101ApiService
        , FF000102ApiService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
         AddressChgPageComponent
        , ConfirmAddressPageComponent
    ],
    exports: [
    ]
})
export class AddressChangeModule { }