import { NgModule } from '@angular/core';
import { ForeignExchangeRoutingModule } from './foreign-exchange-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';


// ---------------- Pages Start ---------------- //
import { ForeignExchangeComponent } from './menu/foreign-exchange-page.component';
import { TwdToForeignServiceModule } from './shared/service/twd-to-foreign.service.module';
import { TwdToForeignService } from './shared/service/twd-to-foreign.service';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';


// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule
        , ForeignExchangeRoutingModule
        , MenuTempModule
        , TwdToForeignServiceModule

    ],
    providers: [
        // ---------------- Service Start ---------------- //
        F5000101ApiService,
        F5000103ApiService,
        F5000105ApiService,
        F5000102ApiService,
        TwdToForeignService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignExchangeComponent
    ]
})
export class ForeignExchangeModule { }
