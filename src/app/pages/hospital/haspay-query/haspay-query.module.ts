import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { QRCodeModule } from 'angular2-qrcode';
import { HaspayQueryRoutingModule } from './haspay-query-routing.module';
// ---------------- Pages Start ---------------- //
import { HaspayQueryPageComponent } from '../haspay-query/haspay-query-page.component';
import { HaspayQueryListPageComponent } from './haspay-query-list/haspay-query-list.component';
import { HaspayQueryDetailPageComponent } from './haspay-query-detail/haspay-query-detail.component';
// ---------------- API Start ---------------- //
import { FH000105ApiService } from '@api/fh/fh000105/fh000105-api.service';
import { FH000106ApiService } from '@api/fh/fh000106/fh000106-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        HaspayQueryRoutingModule,
        QRCodeModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FH000105ApiService,
        FH000106ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        HaspayQueryPageComponent,
        HaspayQueryListPageComponent,
        HaspayQueryDetailPageComponent
    ],
    exports: [
        HaspayQueryPageComponent,
        HaspayQueryListPageComponent,
        HaspayQueryDetailPageComponent
    ]
})
export class HaspayQueryModule { }