/**
 * Route定義
 * epay 變更領獎帳號
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SetacctRoutingModule } from './setacct-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
// ---------------- Pages Start ---------------- //
import { SetacctComponent } from './setacct.component';
// ---------------- API Start ---------------- //
import { FQ000402ApiService } from '@api/fq/fq000402/fq000402-api.service';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    SetacctRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000402ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    SetacctComponent // 推薦人設定
  ]
})
export class SetacctModule { }
