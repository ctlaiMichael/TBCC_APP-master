import { NgModule } from '@angular/core';
import { PersonalQuotaRoutingModule } from './personal-quota-routing.module';

import { SharedModule } from '@shared/shared.module';
// ---------------- 安控 Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //
import { PersonalQuotaComponent } from './inquiry/personal-quota-page.component';

import { PersonalQuotaService } from '@pages/foreign-exchange/shared/service/personal-quota.service';
import { F5000108ApiService } from '@api/f5/f5000108/f5000108-api.service';
//import { F5000107ApiService } from '@api/f5/f5000107/f5000107-api.service';

// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //





@NgModule({
  imports: [
    SharedModule
    , PersonalQuotaRoutingModule
    , SelectSecurityModule         // 安控機制
    , CheckSecurityModule         // 安控機制
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    PersonalQuotaService
    , F5000108ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    PersonalQuotaComponent
  ],

})
export class PersonalQuotaModule { }
