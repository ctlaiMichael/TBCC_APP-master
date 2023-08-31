/**
 * epay
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EpayMenuComponent } from './epay-menu/epay-menu.component';
import { QrcodeBuyEditComponent } from './qrscan/edit/qrcode-buy-edit/qrcode-buy-edit.component';
import { QrcodeGetEditComponent } from './qrscan/edit/qrcode-get-edit/qrcode-get-edit.component';
import { QrcodePayCardEditComponent } from './qrscan/edit/qrcode-pay-card-edit/qrcode-pay-card-edit.component';
import { EditOneComponent } from './qrscan/edit/qrcode-pay-edit/edit-one/edit-one.component';
import { EditTwoComponent } from './qrscan/edit/qrcode-pay-edit/edit-two/edit-two.component';
import { QrcodePayEditCardComponent } from './qrscan/edit/qrcode-pay-edit-card/qrcode-pay-edit-card.component';
import { EditTaxTwoComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-two/edit-tax-two.component';
import { EditTaxFourComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-four/edit-tax-four.component';
import { QrcodePayResultComponent } from './qrscan/result/qrcode-pay-result/qrcode-pay-result.component';
import { QrcodeRedComponent } from './qrscan/result/qrcode-red/qrcode-red.component';
import { InvoicePageComponent } from './invoice/invoice-page/invoice-page.component';
import { ShowReceiptComponent } from './qrscan/show-receipt/show-receipt.component';
import { ShowPayComponent } from './qrscan/show-pay/show-pay.component';
import { QrcodePayTermsComponent } from './card-management/term/qrcode-pay-terms/qrcode-pay-terms.component';
import { CardBindingComponent } from './card-binding/card-binding.component';
import { TaiPowerPaymentComponent } from './tai-power-payment/tai-power-payment.component';
import { SumeFeeComponent } from './tai-power-payment/sume-fee.component';
import { EfeeResultComponent } from './tai-power-payment/efee-result/efee-result.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  // 選單
  , {
    path: 'menu', component: EpayMenuComponent, data: {
    }
  }
  // 交易紀錄/退貨
  , {
    path: 'search', loadChildren: './search-record/search-record.module#SearchRecordModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }

  // ======================================== 開通與設定 ======================================== //
  // 開通SmartPay使用條款/設定帳號
  , {
    path: 'qrcodePayTerms', loadChildren: './smart/smart.module#SmartModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
  // 信用卡新增/變更預設
  , {
    path: 'qrcodePayCardTerms', loadChildren: './card-management/card-management.module#CardManagementModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
  // 推薦人設定
  , {
    path: 'referenceEdit', loadChildren: './recommend/recommend.module#RecommendModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }

  // ======================================== 雲端發票 ======================================== //
  // 發票載具號碼
  , {
    path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
  // 設定領獎帳號
  , {
    path: 'setacct', loadChildren: './setacct/setacct.module#SetacctModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }
  // 變更手機條碼驗證碼
  , {
    path: 'verification', loadChildren: './verification/verification.module#VerificationModule'
    , data: {
      preload: false
    }
    // , canActivate: [LoginRequired]
  }

  // ======================================== 被掃 ======================================== //
  // 出示收款碼
  , {
    path: 'qrcodeShowReceipt', component: ShowReceiptComponent, data: {
    }
  }
  // 出示付款碼
  , {
    path: 'qrcodeShowPay', component: ShowPayComponent, data: {
    }
  }
  // ======================================== 主掃功能 ======================================== //
  // 掃描QRCode
  , {
    path: 'epayscan', loadChildren: './qrscan/onscan/onscan.module#OnscanModule'
    , data: {
      preload: true
    }
    // , canActivate: [LoginRequired]
  }
  // 繳費
  , {
    path: 'qrPay', loadChildren: './qrcode-pay/qrcode-pay.module#QrcodePayModule'
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

  , {
    path: 'qrCodeBuyForm', component: QrcodeBuyEditComponent, data: {
    }
  }
  , {
    path: 'qrCodeGetForm', component: QrcodeGetEditComponent, data: {
    }
  }
  // QR Code emv 付款-輸入金額信用卡
  , {
    path: 'qrCodePayCardForm', component: QrcodePayCardEditComponent, data: {
    }
  }
  , {
    path: 'qrCodePayForm', component: EditOneComponent, data: {
    }
  }
  , {
    path: 'qrCodePayForm2', component: EditTwoComponent, data: {
    }
  }
  , {
    path: 'qrCodePayFormTax2', component: EditTaxTwoComponent, data: {
    }
  }
  , {
    path: 'qrCodePayFormTax4', component: EditTaxFourComponent, data: {
    }
  }
  , {
    path: 'qrcodePayResult', component: QrcodePayResultComponent, data: {
    }
  }
  , {
    path: 'qrcodeRed', component: QrcodeRedComponent, data: {
    }
  }
  // -------------------- outbound -------------------- //
  , {
    path: 'outbound', loadChildren: './outbound/outbound.module#OutboundModule'
    , data: {
      preload: false
    }
  },
  {
    path: 'taipowerOverview', component: TaiPowerPaymentComponent, data: {
    }
  },
  {
    path: 'taipowerSumFee', component: SumeFeeComponent, data: {
    }
  },
  {
    path: 'eFeeResult', component: EfeeResultComponent, data: {
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpayRoutingModule { }
