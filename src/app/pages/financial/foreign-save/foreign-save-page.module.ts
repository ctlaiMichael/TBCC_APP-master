/**
 * 外幣放款利率
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ForeignSavePageRoutingModule } from './foreign-save-page.routing.module';

// ---------------- Model Start ---------------- //
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
// ---------------- Pages Start ---------------- //
import { ForeignSaveDetailPageComponent } from './foreign-save-detail-page.component';
import { ForeignSavePageComponent } from './foreign-save-page.component';

// ---------------- API Start ---------------- //
import { FB000103ApiService } from '@api/fb/fb000103/fb000103-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule
        , FlagFormateModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FB000103ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignSavePageComponent
        , ForeignSaveDetailPageComponent
    ],
    exports: [
        ForeignSavePageComponent
        , ForeignSaveDetailPageComponent
    ]
})
export class ForeignSavePageModule { }
