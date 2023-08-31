/**
 * 開通SmartPay使用條款/設定帳號
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartPayCardComponent } from './smart-pay/smart-pay-card.component';
import { SmartPayResultCardComponent } from './smart-pay-result/smart-pay-result-card.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  // 開通SmartPay使用條款/設定帳號
  , {
    path: 'main', component: SmartPayCardComponent, data: {
    }
  },
  // 開通SmartPay使用條款/設定帳號 結果
  {
    path: 'qrcodePaySettingResult', component: SmartPayResultCardComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartCardRoutingModule { }
