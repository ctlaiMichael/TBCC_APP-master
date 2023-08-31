import { Component, OnInit } from '@angular/core';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';

@Component({
  selector: 'app-bc-reg-edit-page',
  templateUrl: './bc-reg-edit-page.component.html'
})
export class BcRegEditPageComponent implements OnInit {
  phoneNo: string = ''; // 手機號碼
  email: string = ''; // 電子信箱
  constructor(
    private alertService: AlertService,
    private epayService: InvoiceService,
    private navigator: NavgatorService
  ) { }

  ngOnInit() {
  }

  // 清除
  clickClear() {
    this.phoneNo = this.email = '';
  }

  // 確定
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
    } else { // 發送註冊條碼電文 FQ000401
      let reqObj = {
        'email': this.email,
        'phoneNo': this.phoneNo
      }
      this.epayService.sendFQ000401(reqObj).then(
        (resObj) => {
          let newres = this.epayService.convertRes(resObj);
          if (typeof newres == 'string') {
            this.alertService.show(newres);
            return;
          } else {
            // 註冊結果頁 newres帶入
            this.navigator.push('invoicebcregresult', newres);
            return;
          }
        },
        () => {
          this.alertService.show("註冊手機條碼失敗");
          return;
        }
      )
    }
  }
}
