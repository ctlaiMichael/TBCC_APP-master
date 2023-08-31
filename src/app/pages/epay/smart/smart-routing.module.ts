/**
 * 開通SmartPay使用條款/設定帳號
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartPayComponent } from './smart-pay/smart-pay.component';
import { SmartPayResultComponent } from './smart-pay-result/smart-pay-result.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  // 開通SmartPay使用條款/設定帳號
  , {
    path: 'main', component: SmartPayComponent, data: {
    }
  },
  // 開通SmartPay使用條款/設定帳號 結果
  {
    path: 'qrcodePaySettingResult', component: SmartPayResultComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartRoutingModule { }
