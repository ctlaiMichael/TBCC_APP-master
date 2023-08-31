/**
 * epay 信用卡新增/變更預設
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { CardLoginManagementComponent } from './card-login-management.component';
import { QrcodePayTermsCardComponent } from './term/qrcode-pay-terms/qrcode-pay-terms-card.component';
import { CardLoginBindingComponent } from '../card-binding/card-login-binding.component';


const routes: Routes = [
  { path: '', redirectTo: 'term', pathMatch: 'full' }
  // 條款\
  , {
    path: 'term', component: QrcodePayTermsCardComponent, data: {
    }
  }
  // 編輯
  , {
    path: 'add', component: CardLoginManagementComponent, data: {
    }
  }
  // 信用卡綁定結果
  , {
    path: 'result', component: CardLoginBindingComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardLoginManagementRoutingModule { }
