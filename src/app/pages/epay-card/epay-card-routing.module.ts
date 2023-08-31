/**
 * epay
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrcodePayCardEditCardComponent } from './qrscan/edit/qrcode-pay-card-edit/qrcode-pay-card-edit-card.component';
import { EditOneCardComponent } from './qrscan/edit/qrcode-pay-edit/edit-one/edit-one-card.component';
import { EditTwoCardComponent } from './qrscan/edit/qrcode-pay-edit/edit-two/edit-two-card.component';
import { EditTaxTwoCardComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-two/edit-tax-two-card.component';
import { EditTaxFourCardComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-four/edit-tax-four-card.component';
import { QrcodeRedCardComponent } from './qrscan/result/qrcode-red/qrcode-red-card.component';
import { TaiPowerPaymentCardComponent } from './tai-power-payment/tai-power-payment-card.component';
import { EfeeResultCardComponent } from './tai-power-payment/efee-result/efee-result-card.component';
import { QrcodePayResultCardComponent } from './qrscan/result/qrcode-pay-result/qrcode-pay-result-card.component';
import { SumeFeeCardComponent } from './tai-power-payment/sume-fee-card.component';
import { ShowPayCardComponent } from './qrscan/show-pay/show-pay-card.component';
import { EpayMenuCardComponent } from './epay-menu/epay-menu-card.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  // 選單
  , {
    path: 'menu', component: EpayMenuCardComponent, data: {
    }
  }
  // 交易紀錄/退貨
  , {
    path: 'cardlogin-search', loadChildren: './search-record/search-record-card.module#SearchRecordCardModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }

  // ======================================== 開通與設定 ======================================== //
  // 開通SmartPay使用條款/設定帳號
  , {
    path: 'cardlogin-qrcodePayTerms', loadChildren: './smart/smart-card.module#SmartCardModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
  // 信用卡新增/變更預設
  , {
    path: 'cardlogin-qrcodePayCardTerms', loadChildren: './card-management/card-login-management.module#CardLoginManagementModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
 

  // ======================================== 被掃 ======================================== //
  // 出示付款碼
  , {
    path: 'cardlogin-qrcodeShowPay', component: ShowPayCardComponent, data: {
    }
  }
  // ======================================== 主掃功能 ======================================== //
  // 掃描QRCode
  , {
    path: 'cardlogin-epayscan', loadChildren: './qrscan/onscan/onscan-card.module#OnscanCardModule'
    , data: {
      preload: true
    }
    // , canActivate: [LoginRequired]
  }
  // 繳費
  , {
    path: 'cardlogin-qrPay', loadChildren: './qrcode-pay/qrcode-pay-card.module#QrcodePayCardModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
  // TWQRP-繳卡費
  // , {
  //   path: 'qrCodePayFormCard', component: QrcodePayEditCardComponent, data: {
  //   }
  // }


  // QR Code emv 付款-輸入金額信用卡
  , {
    path: 'cardlogin-qrCodePayCardForm', component: QrcodePayCardEditCardComponent, data: {
    }
  }
  , {
    path: 'cardlogin-qrCodePayForm', component: EditOneCardComponent, data: {
    }
  }
  , {
    path: 'cardlogin-qrCodePayForm2', component: EditTwoCardComponent, data: {
    }
  }
  , {
    path: 'cardlogin-qrCodePayFormTax2', component: EditTaxTwoCardComponent, data: {
    }
  }
  , {
    path: 'cardlogin-qrCodePayFormTax4', component: EditTaxFourCardComponent, data: {
    }
  }
  , {
    path: 'cardlogin-qrcodePayResult', component: QrcodePayResultCardComponent, data: {
    }
  }
  , {
    path: 'cardlogin-qrcodeRed', component: QrcodeRedCardComponent, data: {
    }
  }
  // -------------------- outbound -------------------- //
  , 
  {
    path: 'cardlogin-taipowerOverview', component: TaiPowerPaymentCardComponent, data: {
    }
  },
  {
    path: 'cardlogin-taipowerSumFee', component: SumeFeeCardComponent, data: {
    }
  },
  {
    path: 'cardlogin-eFeeResult', component: EfeeResultCardComponent, data: {
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpayCardRoutingModule { }
