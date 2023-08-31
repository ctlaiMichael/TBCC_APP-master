/**
 * Route定義
 * epay 變更手機條碼
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { VerificationRoutingModule } from './verification-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
// ---------------- Pages Start ---------------- //
import { VerificationComponent } from './verification.component';
// ---------------- API Start ---------------- //
import { FQ000404ApiService } from '@api/fq/fq000404/fq000404-api.service';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    VerificationRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000404ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    VerificationComponent // 推薦人設定
  ]
})
export class VerificationModule { }
