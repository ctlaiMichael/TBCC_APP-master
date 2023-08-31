/**
 * Route定義
 * 開通SmartPay使用條款/設定帳號
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SmartCardRoutingModule } from './smart-card-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { StepBarModule } from '@shared/template/stepbar/step-bar.module'; // 步驟列
import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module'; // 網銀登入密碼

// ---------------- Pages Start ---------------- //
import { SmartPayCardComponent } from './smart-pay/smart-pay-card.component';
import { SmartPayResultCardComponent } from './smart-pay-result/smart-pay-result-card.component';
// ---------------- API Start ---------------- //
import { FQ000103ApiService } from '@api/fq/fq000103/fq000103-api.service';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    SmartCardRoutingModule
    , StepBarModule
    , LoginPswdComponentModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000103ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    SmartPayCardComponent
    , SmartPayResultCardComponent
  ]
})
export class SmartCardModule { }
