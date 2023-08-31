/**
 * Route定義
 * epay 推薦人設定
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { RecommendRoutingModule } from './recommend-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
// ---------------- Pages Start ---------------- //
import { RecommendComponent } from './recommend.component';
// ---------------- API Start ---------------- //
import { FQ000108ApiService } from '@api/fq/fq000108/fq000108-api.service';
import { FQ000109ApiService } from '@api/fq/fq000109/fq000109-api.service';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    RecommendRoutingModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000108ApiService
    , FQ000109ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    RecommendComponent // 推薦人設定
  ]
})
export class RecommendModule { }
