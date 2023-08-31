import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NocardRoutingModule } from './nocard-routing.module';
import { NocardSettingModule } from './nocard-setting/nocard-setting.module';
import { NocardRecordModule } from './nocard-transaction-record/nocard-record.module';
import { NocardReservationModule } from './nocard-transaction-reservation/nocard-reservation.module';
import { NocardResultComponent } from './nocard-result/nocard-result-page.component';
import { NocardMenuModule } from './nocard-menu/nocard-menu.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CheckSecurityModule,
    NocardRoutingModule,
    NocardMenuModule,
    NocardReservationModule,
    NocardRecordModule,
    NocardSettingModule
  ],
  providers: [

  ],
  declarations: [
    NocardResultComponent
  ]
})
export class NocardModule { }
