import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { AccountSetPageComponent } from '@pages/hospital/account-set/account-set-page.component';

// ---------------- API Start ---------------- //
import { FH000101ApiService } from '@api/fh/fh000101/fh000101-api.service';
import { FH000102ApiService } from '@api/fh/fh000102/fh000102-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FH000101ApiService,
        FH000102ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        AccountSetPageComponent
    ],
    exports: [
        AccountSetPageComponent
    ]
})
export class AccountSetModule { }