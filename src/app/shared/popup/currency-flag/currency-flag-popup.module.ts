/**
 * 外幣匯率popup
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

// ---------------- Model Start ---------------- //
import { RateFormateModule } from '@shared/formate/number/rate/rate-formate.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //
import { CurrencyFlagPopupComponent } from './currency-flag-popup.component';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        FlagFormateModule,
        RateFormateModule,
        BookmarkModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        CurrencyFlagPopupComponent
    ],
    exports: [
        CurrencyFlagPopupComponent
    ]
})
export class CurrencyFlagPopupModule { }
