/**
 * epay 信用卡新增/變更預設
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { CardManagementComponent } from './card-management.component';
import { QrcodePayTermsComponent } from './term/qrcode-pay-terms/qrcode-pay-terms.component';
import { CardBindingComponent } from '@pages/epay/card-binding/card-binding.component';


const routes: Routes = [
  { path: '', redirectTo: 'term', pathMatch: 'full' }
  // 條款\
  , {
    path: 'term', component: QrcodePayTermsComponent, data: {
    }
  }
  // 編輯
  , {
    path: 'add', component: CardManagementComponent, data: {
    }
  }
  // 信用卡綁定結果
  , {
    path: 'result', component: CardBindingComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardManagementRoutingModule { }
