/**
 * 金融資訊
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { FinancialRoutingModule } from './financial-routing.module';
// == 基本設定 == //
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';

// ==Component: 欲使用的component== //
import { FinancialComponent } from './financial.component';

// ==Service: 欲使用的service== //
// ==Telegram: 欲使用的service== //

// -------------------------------- LazyLoad START -------------------------------- //


// -------------------------------- LazyLoad End -------------------------------- //



@NgModule({
    imports: [
        SharedModule,
        FinancialRoutingModule,
        FlagFormateModule,
        MenuTempModule
    ],
    exports: [
    ],
    providers: [
    ],
    declarations: [
        // == 請使用的component放此 == //
        FinancialComponent
    ]
})
export class FinancialModule {
    constructor(
    ) {
    }
}
