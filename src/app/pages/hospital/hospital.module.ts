import { NgModule } from '@angular/core';
import { HospitalRoutingModule } from './hospital-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HaspayQueryModule } from './haspay-query/haspay-query.module';
import { AccountSetModule } from './account-set/account-set.module';
import { CaptchaModule } from '@shared/captcha/captcha.moudle';


// ---------------- Pages Start ---------------- //
import { HospitalMenuPageComponent } from '@pages/hospital/hospital-menu/hospital-menu-page.component';
import { BranchMenuPageComponent } from '@pages/hospital/branch-menu/branch-menu-page.component';

// ---------------- API Start ---------------- //
import { FH000301ApiService } from '@api/fh/fh000301/fh000301-api.service';
import { FH000302ApiService } from '@api/fh/fh000302/fh000302-api.service';
import { FH000105ApiService } from '@api/fh/fh000105/fh000105-api.service';
import { FH000204ApiService } from '@api/fh/fh000204/fh000204-api.service';
import { FH000207ApiService } from '@api/fh/fh000207/fh000207-api.service';
import { FH000205ApiService } from '@api/fh/fh000205/fh000205-api.service';


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    HospitalRoutingModule,
    HaspayQueryModule,
    AccountSetModule,
    CaptchaModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FH000301ApiService,
    FH000302ApiService,
    FH000105ApiService,
    FH000205ApiService,
    FH000204ApiService,
    FH000207ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    HospitalMenuPageComponent,
    BranchMenuPageComponent
  ]
})
export class HospitalModule { }
