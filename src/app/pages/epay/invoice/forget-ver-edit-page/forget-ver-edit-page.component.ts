import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { AlertService } from '@shared/popup/alert/alert.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-forget-ver-edit-page',
    templateUrl: './forget-ver-edit-page.component.html'
})
export class ForgetVerEditPageComponent implements OnInit {
    phoneNo: string = ''; // 手機號碼
    email: string = ''; // 電子信箱
    constructor(
        private navigator: NavgatorService,
        private alertService: AlertService,
        private epayService: InvoiceService,
        private _headerCtrl: HeaderCtrlService
    ) {
        //查詢驗證碼頁面，左上固定返回查詢手機條碼頁面
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.navigator.push('invoicequerymobilebckey');
        });
    }

    ngOnInit() {
    }

    // 重發驗證碼
    clickSubmit() {
        var res = /^[0-9]*$/;
        let checkMobile = UserCheckUtil.checkMobile(this.phoneNo);
        let checkEmail = UserCheckUtil.checkEmail(this.email);
        if (this.phoneNo.length <= 0) {
            this.alertService.show("FIELD.PHONE_EDIT"); // 請輸入手機號碼
        } else if (!res.test(this.phoneNo)) {
            this.alertService.show("手機號碼須為數字");
            return;
        } else if (!checkMobile.status) { // 檢查手機號碼格式
            this.alertService.show(checkMobile.msg);
            return;
        } else if (this.email.length <= 0) {
            this.alertService.show("請輸入Email信箱");
            return;
        } else if (!checkEmail.status) {
            this.alertService.show(checkEmail.msg);
        } else {
            let reqObj = {
                'email': this.email,
                'phoneNo': this.phoneNo
            }
            this.epayService.sendFQ000405(reqObj).then(
                (resObj) => {
                    let newres = this.epayService.convertRes(resObj);
                    if (typeof newres == 'string') {
                        this.alertService.show(newres);
                        return;
                    } else {
                        this.navigator.push('invoiceforgetverresult', newres);
                    }
                },
                () => {
                    this.alertService.show("查詢驗證碼失敗");
                }
            )
        }
        // this.navigator.push('invoiceforgetverresult');
    }

    // 清除
    clickClear() {
        this.phoneNo = this.email = '';
    }

}
