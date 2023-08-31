/**
 * 外幣匯率
 */
import { NgModule } from '@angular/core';
import { ExchangeRoutingModule } from './exchange.routing.module';
import { SharedModule } from '@shared/shared.module';

// // ---------------- Model Start ---------------- //
// import { RateFormateModule } from '@shared/formate/number/rate/rate-formate.module';
// import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
// import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
// // ---------------- Pages Start ---------------- //
// import { ExchangePageComponent } from './exchange-page.component';
// import { ExchangeCalculatePageComponent } from './exchange-calculate-page.component';
// // ---------------- API Start ---------------- //
// import { FB000201ApiService } from '@api/fb/fb000201/fb000201-api.service';
// import { CurrencyFlagPopupModule } from '@shared/popup/currency-flag/currency-flag-popup.module';
import { ExchangePageModule } from './exchange-page.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        ExchangeRoutingModule,
        SharedModule,
        ExchangePageModule
        // FlagFormateModule,
        // RateFormateModule,
        // BookmarkModule,
        // CurrencyFlagPopupModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    //    FB000201ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        //  ExchangePageComponent
        // , ExchangeCalculatePageComponent
    ],
    exports: [
        // ExchangePageComponent
        // , ExchangeCalculatePageComponent
    ]
})
export class ExchangeModule { }
