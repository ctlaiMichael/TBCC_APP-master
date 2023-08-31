import { Component, OnInit } from '@angular/core';
import { EPayService } from '../shared/epay.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FQ000404ApiService } from '@api/fq/fq000404/fq000404-api.service';
import { FQ000404ReqBody } from '@api/fq/fq000404/fq000404-req';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {


  onePage = true;

  barcode = {
    cardNo: '',
  };

  Verify = {
    oldVerify: '',
    newVerify: '',
    newVerify2: ''
  };

  errorMsg = {
    oldVerify: '',
    newVerify: '',
    newVerify2: '',
  };

  constructor(
    private epay: EPayService,
    private alert: AlertService,
    private navgator: NavgatorService,
    private handleError: HandleErrorService,
    private fq000404: FQ000404ApiService
  ) { }

  ngOnInit() {
    this.sendFQ000101();
  }

  async sendFQ000101() {
    try {
      const fq000101Data: any = await this.epay.sendFQ000101('T');
      if (typeof fq000101Data.mobileBarcode === 'undefined' || fq000101Data.mobileBarcode === '') {
        this.alert.show('無發票載具條碼資訊請先查詢或註冊您的發票載具條碼').then(
          res => {
            this.navgator.push('invoice');
          });
      } else {
        this.barcode.cardNo = fq000101Data.mobileBarcode;
      }
    } catch (error) {
      this.alert.show('手機條碼讀取失敗').then(
        res => {
          this.navgator.push('epay');
        }
      );
    }
  }
  clickClear() {
    this.Verify.oldVerify = '';
    this.Verify.newVerify = '';
    this.Verify.newVerify2 = '';
  }

  clickSubmit = function () {
    // 檢查原驗證碼
    if ((this.Verify.oldVerify === '') || (typeof this.Verify.oldVerify === 'undefined')) {
      this.errorMsg.oldVerify = '請輸入 [原驗證碼]';
      return;
    }
    if (this.Verify.oldVerify.length < 4 || this.Verify.oldVerify.length > 16) {
      this.errorMsg.oldVerify = '[原驗證碼] 長度需 4~16 碼';
      return;
    }

    this.errorMsg.oldVerify = '';

    // 檢查新驗證碼
    if ((this.Verify.newVerify === '') || (typeof this.Verify.newVerify === 'undefined')) {
      this.errorMsg.newVerify = '請輸入 [新驗證碼]';
      return;
    }
    if (this.Verify.newVerify.length < 8 || this.Verify.newVerify.length > 16) {
      this.errorMsg.newVerify = '[新驗證碼]長度需 8~16 碼';
      return;
    }

    let res = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;
    if (!res.test(this.Verify.newVerify)) {
      this.errorMsg.newVerify = '[新驗證碼]須有數字與英文字母';
      return;
    }

    this.errorMsg.newVerify = '';

    if ((this.Verify.newVerify2 === '') || (typeof this.Verify.newVerify2 === 'undefined')) {
      this.errorMsg.newVerify2 = '請輸入[再次輸入新驗證碼]';
      return;
    }

    this.errorMsg.newVerify2 = '';

    if (this.Verify.newVerify !== this.Verify.newVerify2) {
      this.errorMsg.newVerify = '[新驗證碼]與[再次輸入新驗證碼]須相同';
      return;
    }
    this.errorMsg.newVerify = '';

    const form = new FQ000404ReqBody();
    form.mobileBarcode = this.barcode.cardNo;
      form.verifyCode = this.Verify.oldVerify;
      form.newVerifyCode = this.Verify.newVerify;
    this.fq000404.send(form)
      .then(
        (fq000404res) => {
          this.onePage = false;
        }).catch(
          error => {
            this.handleError.handleError({
              type: 'dialog',
              title: 'ERROR.TITLE',
              content: '變更手機條碼驗證碼失敗'
            });
          });
  };

  Check() {
    this.navgator.push('epay');
  }
}
