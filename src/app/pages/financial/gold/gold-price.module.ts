import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { GoldPageComponent } from '@pages/financial/gold/gold-page.component';
import { GoldNowPageComponent } from '@pages/financial/gold/gold-now-page.component';
import { GoldHistoryPageComponent } from '@pages/financial/gold/gold-history-page.component';

// ---------------- API Start ---------------- //


import { FB000701ApiService } from '@api/fb/fb000701/fb000701-api.service';
import { FB000702ApiService } from '@api/fb/fb000702/fb000702-api.service';
import { GoldPriceRoutingModule } from './gold-price.routing.module';
import { ChartModule } from '@shared/chart/chart.module';
import { DateRangeSearchComponent } from '@shared/template/text/date-range-search/date-range-search.component';
import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        ChartModule,
        GoldPriceRoutingModule,
        DateRangeSearchComponentModule
        //DateRangeSearchComponent
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000701ApiService
        , FB000702ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        GoldPageComponent
        , GoldHistoryPageComponent
        , GoldNowPageComponent
    ],
    exports: [
    ]
})
export class GoldPriceModule { }