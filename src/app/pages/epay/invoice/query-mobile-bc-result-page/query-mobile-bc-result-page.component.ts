import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-query-mobile-bc-result-page',
    templateUrl: './query-mobile-bc-result-page.component.html'
})
export class QueryMobileBcResultPageComponent implements OnInit {
    barcodeWidth = 1.8; // barcode寬度設定
    result: any; // 傳入此頁之參數
    mobileBarcode: string; // 手機條碼
    constructor(
        private navigator: NavgatorService,
        private alertService: AlertService,
        private epayService: InvoiceService
    ) { }

    ngOnInit() {
        this.result = this.navigator.getParams();
        this.mobileBarcode = this.result.cardNo;
    }

    clickSubmit() {
        // this.navigator.push('invoiceeditbarcodekey', this.mobileBarcode);

        let reqObj = {
            'mobileBarcode': this.mobileBarcode,
            'loveCode': '',
            'socialWelfareName': '',
            'defaultBarcode': '1' // 發票預設值 =1為雲端發票條碼，發票預設值 = 2為捐贈愛心碼
        }
        this.epayService.sendFQ000301(reqObj).then(
            (resObj) => {
                this.alertService.show("手機條碼設定成功").then(
                    () => {
                        this.navigator.push('invoice');
                        return;
                    },
                    () => { }
                );

            },
            () => {
                this.navigator.push('invoicequerymobilebckey');
            }
        )
    }


}
