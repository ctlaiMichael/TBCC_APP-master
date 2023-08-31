/**
 * 票券查詢
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TwdLoanPageRoutingModule } from './twd-loan-page.routing.module';

// ---------------- Pages Start ---------------- //
import { TwdLoanPageComponent } from './twd-loan-page.component';

// ---------------- API Start ---------------- //
import { FB000102ApiService } from '@api/fb/fb000102/fb000102-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        TwdLoanPageRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000102ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        TwdLoanPageComponent
    ],
    exports: [
    ]
})
export class TwdLoanPageModule { }
