/**
 * 票券查詢
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TicketRatePageRoutingModule } from './ticket-rate-page.routing.module';

// ---------------- Model Start ---------------- //
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
// ---------------- Pages Start ---------------- //
import { TicketRatePageComponent } from './ticket-rate-page.component';

// ---------------- API Start ---------------- //
import { FB000106ApiService } from '@api/fb/fb000106/fb000106-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        TicketRatePageRoutingModule
        , BookmarkModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000106ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        TicketRatePageComponent
    ],
    exports: [
    ]
})
export class TicketRatePageModule { }
