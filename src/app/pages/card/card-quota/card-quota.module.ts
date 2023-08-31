/**
 * Route定義
 * 額度調整
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CardQuotaRoutingModule } from './card-quota-routing.module';
import { SmsModule } from '@shared/transaction-security/sms/sms.module';
import { CardUploadModule } from './card-upload/card-upload.module';
// ---------------- Pages Start ---------------- //
import { CardQuotaMenuComponent } from './card-quota-menu.component';
import { CardQuotaComponent } from './card-quota-main/card-quota.component';
import { CardQuotaConfirmComponent } from './card-quota-confirm/card-quota-confirm.component';
import { CardQuotaResultComponent } from './card-quota-result/card-quota-result.component';
// ---------------- API Start ---------------- //
import { FC001003ApiService } from '@api/fc/fc001003/fc001003-api.service';
import { FC001004ApiService } from '@api/fc/fc001004/fc001004-api.service';
import { FC001005ApiService } from '@api/fc/fc001005/fc001005-api.service';
import { FC001009ApiService } from '@api/fc/fc001009/fc001009-api.service';
// ---------------- Service Start ---------------- //
import { CardQuotaServiceModule } from '../shared/service/card-quota/card-quota-service.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';



@NgModule({
  imports: [
    SharedModule,
    CardQuotaRoutingModule,
    CardQuotaServiceModule,
    SmsModule,
    CardUploadModule,
    MenuTempModule
  ],
  providers: [
    // ---------------- Service Start ---------------- /
    FC001003ApiService,
    FC001004ApiService,
    FC001005ApiService,
    FC001009ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    CardQuotaMenuComponent,
    CardQuotaComponent,
    CardQuotaConfirmComponent,
    CardQuotaResultComponent
  ]
})
export class CardQuotaModule { }
