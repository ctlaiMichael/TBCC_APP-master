/**
 * Route定義
 * DEMO (若大功能子層太多，可增加資料夾管理)
 */
// == 基本設定 == //
import { NgModule, ModuleWithProviders } from '@angular/core';
import { GoldRoutingModule } from './gold-business-routing.module';
import { SharedModule } from '@shared/shared.module';
// ==Component: 欲使用的component== //
import { GoldMenuPageComponent } from '@pages/gold-business/gold-menu/gold-menu-page.component';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { CommonModule } from '@angular/common';
import { GoldSellModule } from './gold-sell/gold-sell.module';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';
@NgModule({
    imports: [
        SharedModule,
        GoldRoutingModule,
        MenuTempModule,
        CommonModule,

        GoldSellModule
    ],
    declarations: [
        GoldMenuPageComponent

    ]
})
export class GoldBusinessModule {
    constructor(
    ) {
    }
}
