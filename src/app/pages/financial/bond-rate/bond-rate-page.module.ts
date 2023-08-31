/**
 * 債券利率
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BondRatePageRoutingModule } from './bond-rate-page.routing.module';

// ---------------- Pages Start ---------------- //
import { BondRatePageComponent } from './bond-rate-page.component';

// ---------------- API Start ---------------- //
import { FB000107ApiService } from '@api/fb/fb000107/fb000107-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        BondRatePageRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000107ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        BondRatePageComponent
    ],
    exports: [
    ]
})
export class BondRatePageModule { }
