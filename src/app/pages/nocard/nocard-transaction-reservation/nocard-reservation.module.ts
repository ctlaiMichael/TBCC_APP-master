import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NocardReservationRoutingModule } from './nocard-reservation-routing.module';
// ---------------- Pages Start ---------------- //
import { NocardTransEditComponent } from './nocard-trans-edit/nocard-trans-edit-page.component';
import { NocardTransConfirmComponent } from './nocard-trans-confirm/nocard-trans-confirm-page.component';
// ---------------- API Start ---------------- //  TODO 要改成無卡提款的
import { FN000104ApiService } from '@api/fn/fn000104/fn000104-api.service';
import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { BI000100ApiService } from '@api/bi/bi000100/bi000100-api.service';
import { BI000101ApiService } from '@api/bi/bi000101/bi000101-api.service';
import { BI000102ApiService } from '@api/bi/bi000102/bi000102-api.service';

// ---------------- Service Start ---------------- //
import { BiometricService } from '@lib/plugins/biometric.service';
import { FtLoginService } from '@pages/login/shared/ftlogin.service';
import { NocardTransService } from '../shared/service/nocard-trans.service';
import { NocardAccountService } from '../shared/service/nocard-account.service';
import { LoginModule } from '@pages/login/login.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LoginModule,
    NocardReservationRoutingModule
  ],
  providers: [
    FN000104ApiService,
    NocardTransService,
    NocardAccountService
  ],
  declarations: [
    NocardTransEditComponent,
    NocardTransConfirmComponent,
  ]
})
export class NocardReservationModule { }
