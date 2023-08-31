/**
 * Route定義
 * epay
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angular2-qrcode';
import { EpayFormateModule } from '@pages/epay-card/shared/pipe/epay-formate.module'; // epay formate專用
// 安控
import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //
import { FQ000101ApiService } from '@api/fq/fq000101/fq000101-api.service'; // QR Code轉出帳號查詢
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
// ---------------- Service Start ---------------- //
import { EPayCardService } from './shared/epay-card.service';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { BiometricService } from '@lib/plugins/biometric.service';
// ---------------- Shared Start ---------------- //
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { FQ000114ApiService } from '@api/fq/fq000114/fq000114-api.service';
import { FQ000105ApiService } from '@api/fq/fq000105/fq000105-api.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FQ000111ApiService } from '@api/fq/fq000111/fq000111-api.service';
import { FQ000110ApiService } from '@api/fq/fq000110/fq000110-api.service';
import { FC001001ApiService } from '@api/fc/fc001001/fc001001-api.service';
import { FQ000201ApiService } from '@api/fq/fq000201/fq000201-api.service';
import { FQ000202ApiService } from '@api/fq/fq000202/fq000202-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { FQ000203ApiService } from '@api/fq/fq000203/fq000203-api.service';
import { FQ000303ApiService } from '@api/fq/fq000303/fq000303-api.service';
import { FQ000302ApiService } from '@api/fq/fq000302/fq000302-api.service';
import { FQ000420ApiService } from '@api/fq/fq000420/fq000420-api.service';
import { FQ000306ApiService } from '@api/fq/fq000306/fq000306-api.service';
import { FQ000307ApiService } from '@api/fq/fq000307/fq000307-api.service';
import { ShortcutService } from '@lib/plugins/shortcut.service';
import { FQ000113ApiService } from '@api/fq/fq000113/fq000113-api.service';

import { ScanComponent } from '@pages/scan/scan/scan.component';
import { TaiPowerService } from './shared/taiPower.service';
import { FQ000501ApiService } from '@api/fq/fq000501/fq000501-api.service';
import { FQ000502ApiService } from '@api/fq/fq000502/fq000502-api.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { FQ000421ApiService } from '@api/fq/fq000421/fq000421-api.service';
import { FQ000115ApiService } from '@api/fq/fq000115/fq000115-api.service';
import { FQ000116ApiService } from '@api/fq/fq000116/fq000116-api.service';
import { OnscanCardService } from './shared/service/onscan-card.service';
import { FQ000104ApiService } from '@api/fq/fq000104/fq000104-api.service';
import { FQ000102ApiService } from '@api/fq/fq000102/fq000102-api.service';
import { EpayCardRoutingModule } from './epay-card-routing.module';

import { SumeFeeCardComponent } from './tai-power-payment/sume-fee-card.component';
import { EfeeResultCardComponent } from './tai-power-payment/efee-result/efee-result-card.component';
import { TaiPowerPaymentCardComponent } from './tai-power-payment/tai-power-payment-card.component';
import { ShowPayCardComponent } from './qrscan/show-pay/show-pay-card.component';
import { QrcodeRedCardComponent } from './qrscan/result/qrcode-red/qrcode-red-card.component';
import { QrcodePayResultCardComponent } from './qrscan/result/qrcode-pay-result/qrcode-pay-result-card.component';
import { EditTaxFourCardComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-four/edit-tax-four-card.component';
import { EditTaxTwoCardComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-two/edit-tax-two-card.component';
import { EditTwoCardComponent } from './qrscan/edit/qrcode-pay-edit/edit-two/edit-two-card.component';
import { EditOneCardComponent } from './qrscan/edit/qrcode-pay-edit/edit-one/edit-one-card.component';
import { QrcodePayCardEditCardComponent } from './qrscan/edit/qrcode-pay-card-edit/qrcode-pay-card-edit-card.component';
import { ShowReceiptCardomponent } from './qrscan/show-receipt/show-receipt-card.component';
import { EpayMenuCardComponent } from './epay-menu/epay-menu-card.component';
import { QRTpyeCardService } from './shared/qrocdeType-card.service';
// ---------------- Pages Start ---------------- //



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        EpayCardRoutingModule,
        EpayFormateModule,
        MenuTempModule,
        SelectSecurityModule,
        CheckSecurityModule,
        NgxBarcodeModule,
        QRCodeModule,
        LoginPswdComponentModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        EPayCardService,
        QrcodeService,
        QRTpyeCardService,
        OnscanCardService,
        BiometricService,
        TaiPowerService,
        LocalStorageService,
        FQ000101ApiService,
        F5000101ApiService,
        FQ000112ApiService,
        FQ000114ApiService,
        FQ000105ApiService,
        FH000203ApiService,
        FQ000111ApiService,
        FQ000110ApiService,
        FC001001ApiService,
        FQ000201ApiService,
        FQ000202ApiService,
        F4000101ApiService,
        FQ000203ApiService,
        FQ000306ApiService,
        FQ000307ApiService,
        FQ000303ApiService,
        FQ000302ApiService,
        FQ000420ApiService,
        ShortcutService,
        FQ000421ApiService,
        FQ000113ApiService,
        FQ000501ApiService,
	    FQ000502ApiService,
	    FQ000115ApiService,
	    FQ000116ApiService,
	    FQ000104ApiService,
	    FQ000102ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        EpayMenuCardComponent // epay選單

        // ---------------- [TODO] ---------------- //
        ,
        QrcodePayCardEditCardComponent,
        EditOneCardComponent,
        EditTwoCardComponent,
        EditTaxTwoCardComponent,
        EditTaxFourCardComponent,
        QrcodePayResultCardComponent,
        QrcodeRedCardComponent,
        ShowReceiptCardomponent,
        ShowPayCardComponent,
        TaiPowerPaymentCardComponent,
        EfeeResultCardComponent,
        SumeFeeCardComponent
    ]
})
export class EpayCardModule { }
