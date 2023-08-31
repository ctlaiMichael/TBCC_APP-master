/**
 * Route定義
 * epay
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { EpayRoutingModule } from './epay-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angular2-qrcode';
import { EpayFormateModule } from '@pages/epay/shared/pipe/epay-formate.module'; // epay formate專用
// 安控
import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //
import { EpayMenuComponent } from './epay-menu/epay-menu.component';

// ---------------- API Start ---------------- //
import { FQ000101ApiService } from '@api/fq/fq000101/fq000101-api.service'; // QR Code轉出帳號查詢
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
// ---------------- Service Start ---------------- //
import { EPayService } from './shared/epay.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { BiometricService } from '@lib/plugins/biometric.service';
// ---------------- Shared Start ---------------- //
import { QrcodeBuyEditComponent } from './qrscan/edit/qrcode-buy-edit/qrcode-buy-edit.component';
import { QrcodeGetEditComponent } from './qrscan/edit/qrcode-get-edit/qrcode-get-edit.component';
import { QrcodePayCardEditComponent } from './qrscan/edit/qrcode-pay-card-edit/qrcode-pay-card-edit.component';
import { EditOneComponent } from './qrscan/edit/qrcode-pay-edit/edit-one/edit-one.component';
import { EditTwoComponent } from './qrscan/edit/qrcode-pay-edit/edit-two/edit-two.component';
import { QrcodePayEditCardComponent } from './qrscan/edit/qrcode-pay-edit-card/qrcode-pay-edit-card.component';
import { EditTaxTwoComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-two/edit-tax-two.component';
import { EditTaxFourComponent } from './qrscan/edit/qrcode-pay-edit-tax/edit-tax-four/edit-tax-four.component';
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { FQ000114ApiService } from '@api/fq/fq000114/fq000114-api.service';
import { FQ000105ApiService } from '@api/fq/fq000105/fq000105-api.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { QrcodePayResultComponent } from './qrscan/result/qrcode-pay-result/qrcode-pay-result.component';
import { QrcodeRedComponent } from './qrscan/result/qrcode-red/qrcode-red.component';
import { FQ000111ApiService } from '@api/fq/fq000111/fq000111-api.service';
import { FQ000110ApiService } from '@api/fq/fq000110/fq000110-api.service';
import { FC001001ApiService } from '@api/fc/fc001001/fc001001-api.service';
import { FQ000201ApiService } from '@api/fq/fq000201/fq000201-api.service';
import { FQ000202ApiService } from '@api/fq/fq000202/fq000202-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { FQ000203ApiService } from '@api/fq/fq000203/fq000203-api.service';
import { FQ000303ApiService } from '@api/fq/fq000303/fq000303-api.service';
import { ShowReceiptComponent } from './qrscan/show-receipt/show-receipt.component';
import { ShowPayComponent } from './qrscan/show-pay/show-pay.component';
import { FQ000302ApiService } from '@api/fq/fq000302/fq000302-api.service';
import { FQ000420ApiService } from '@api/fq/fq000420/fq000420-api.service';
import { FQ000306ApiService } from '@api/fq/fq000306/fq000306-api.service';
import { FQ000307ApiService } from '@api/fq/fq000307/fq000307-api.service';
import { ShortcutService } from '@lib/plugins/shortcut.service';
import { FQ000113ApiService } from '@api/fq/fq000113/fq000113-api.service';
import { TaiPowerPaymentComponent } from './tai-power-payment/tai-power-payment.component';
import { SumeFeeComponent } from './tai-power-payment/sume-fee.component';

import { ScanComponent } from '@pages/scan/scan/scan.component';
import { EfeeResultComponent } from './tai-power-payment/efee-result/efee-result.component';
import { TaiPowerService } from './shared/taiPower.service';
import { FQ000501ApiService } from '@api/fq/fq000501/fq000501-api.service';
import { FQ000502ApiService } from '@api/fq/fq000502/fq000502-api.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { FQ000421ApiService } from '@api/fq/fq000421/fq000421-api.service';
import { FQ000115ApiService } from '@api/fq/fq000115/fq000115-api.service';
import { FQ000116ApiService } from '@api/fq/fq000116/fq000116-api.service';
import { OnscanService } from './shared/service/onscan.service';
import { FQ000104ApiService } from '@api/fq/fq000104/fq000104-api.service';
import { FQ000102ApiService } from '@api/fq/fq000102/fq000102-api.service';
// ---------------- Pages Start ---------------- //



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        EpayRoutingModule,
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
        EPayService,
        QrcodeService,
        QRTpyeService,
        OnscanService,
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
        EpayMenuComponent // epay選單

        // ---------------- [TODO] ---------------- //
        ,
        QrcodeBuyEditComponent,
        QrcodeGetEditComponent,
        QrcodePayCardEditComponent,
        EditOneComponent,
        EditTwoComponent,
        QrcodePayEditCardComponent, // 已廢除，待刪除
        EditTaxTwoComponent,
        EditTaxFourComponent,
        QrcodePayResultComponent,
        QrcodeRedComponent,
        ShowReceiptComponent,
        ShowPayComponent,
        TaiPowerPaymentComponent,
        SumeFeeComponent,
        EfeeResultComponent,
    ]
})
export class EpayModule { }
