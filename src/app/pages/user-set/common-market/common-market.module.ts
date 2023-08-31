import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonMarketRoutingModule } from './common-market.routing.module';

import { CommonMarketPageComponent } from './common-market-page.component';

// ---------------- API Start ---------------- //

import { FG000407ApiService } from '@api/fg/fg000407/fg000407-api.service';

import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        UserSetCertifyModule,
        UserSetResultModule,
        CommonMarketRoutingModule


    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FG000407ApiService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        CommonMarketPageComponent
    ],
    exports: [
    ]
})
export class CommonMarketModule { }