import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { NavgatorService } from '@core/navgator/navgator.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-query-mobile-bc-page',
    templateUrl: './query-mobile-bc-page.component.html'
})

// 查詢手機條碼
export class QueryMobileBcPageComponent implements OnInit {
    phoneNo: string = ''; // 手機號碼
    verifyCode: string = ''; // 手機條碼驗證碼
    constructor(
        private alertService: AlertService,
        private epayService: InvoiceService,
        private navigator: NavgatorService,
        private _headerCtrl: HeaderCtrlService
    ) {
        //查詢手機條碼頁面，左上固定返回發票載具條碼首頁
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.navigator.push('invoice', {}, {changeDefaultCode: '1'});
        });
    }

    ngOnInit() {
    }

    /**
     * 查詢驗證碼
     */
    clickForgetVer() {
        this.navigator.push('invoiceforgetveredit');
    }

    /**
     * 清除
     */
    clickClear() {
        this.phoneNo = '';
        this.verifyCode = '';
    }

    /**
     * 確定-查詢手機條碼
     */
    clickSubmit() {
        var res = /^[0-9]*$/;
        let checkMobile = UserCheckUtil.checkMobile(this.phoneNo);
        if (this.phoneNo.length <= 0) {
            this.alertService.show("FIELD.PHONE_EDIT"); // 請輸入手機號碼
        } else if (!res.test(this.phoneNo)) {
            this.alertService.show("手機號碼須為數字");
            return;
        } else if (!checkMobile.status) { // 檢查手機號碼格式
            this.alertService.show(checkMobile.msg);
            return;
        } else if ((this.verifyCode == "") || (typeof this.verifyCode == 'undefined')) {
            this.alertService.show("請輸入手機條碼驗證碼");
            return;
        } else if (this.verifyCode.length < 4 || this.verifyCode.length > 16) {
            this.alertService.show('手機條碼驗證碼長度需 4~16 碼');
            return;
        } else {
            let reqObj = {
                'phoneNo': this.phoneNo,
                'verifyCode': this.verifyCode
            }
            this.epayService.sendFQ000403(reqObj).then(
                (resObj) => {
                    // if (resObj.status) {
                    //     this.navigator.push('invoicequerymobilebcresultkey', resObj.body);
                    // } else {
                    //     this.alertService.show(resObj.msg);
                    // }
                    let newres = this.epayService.convertRes(resObj);
                    if (typeof newres == "string") {
                        this.alertService.show(newres);
                        return;
                    } else {
                        this.navigator.push('invoicequerymobilebcresultkey', newres);
                    }
                },
                (errObj) => {
                    this.alertService.show('手機條碼查詢失敗，請再查詢一次');
                }
            );
        }
    }

}
