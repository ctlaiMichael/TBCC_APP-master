import { NgModule } from '@angular/core';
import { DepositRoutingModule } from './deposit-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';

// ---------------- Pages Start ---------------- //
import { DepositMenuComponent } from './deposit-menu/deposit-menu-page.component';


// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //


// ---------------- Shared Start ---------------- //


@NgModule({
    imports: [
        SharedModule
        , DepositRoutingModule
        , MenuTempModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        DepositMenuComponent
    ]
})
export class DepositModule { }
