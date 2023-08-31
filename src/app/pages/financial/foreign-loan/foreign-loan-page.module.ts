/**
 * 台幣放款利率
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ForeignLoanPageRoutingModule } from './foreign-loan-page.routing.module';

// ---------------- Model Start ---------------- //
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
// ---------------- Pages Start ---------------- //
import { ForeignLoanPageComponent } from './foreign-loan-page.component';

// ---------------- API Start ---------------- //
import { FB000105ApiService } from '@api/fb/fb000105/fb000105-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        ForeignLoanPageRoutingModule
        , FlagFormateModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000105ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignLoanPageComponent
    ],
    exports: [
    ]
})
export class ForeignLoanPageModule { }
