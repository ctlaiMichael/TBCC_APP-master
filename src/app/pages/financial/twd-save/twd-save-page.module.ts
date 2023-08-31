/**
 * 票券查詢
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TwdSavePageRoutingModule } from './twd-save-page.routing.module';

// ---------------- Pages Start ---------------- //
import { TwdSavePageComponent } from './twd-save-page.component';

// ---------------- API Start ---------------- //
import { FB000101ApiService } from '@api/fb/fb000101/fb000101-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        TwdSavePageRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000101ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        TwdSavePageComponent
    ],
    exports: [
    ]
})
export class TwdSavePageModule { }
