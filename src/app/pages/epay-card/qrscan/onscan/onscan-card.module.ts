/**
 * Route定義
 * epay onscan 主掃
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { OnscanCardRoutingModule } from './onscan-card-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { EpayFormateModule } from '@pages/epay/shared/pipe/epay-formate.module'; // epay formate專用

// ---------------- Pages Start ---------------- //
import { OnscanCardComponent } from './onscan-card.component';
// ---------------- API Start ---------------- //
import { FQ000104ApiService } from '@api/fq/fq000104/fq000104-api.service';
import { FQ000102ApiService } from '@api/fq/fq000102/fq000102-api.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    OnscanCardRoutingModule,
    EpayFormateModule,
    CommonModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000104ApiService,
    FQ000102ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    OnscanCardComponent
  ]
})
export class OnscanCardModule { }
