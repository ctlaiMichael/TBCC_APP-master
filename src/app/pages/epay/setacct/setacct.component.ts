import { Component, OnInit } from '@angular/core';
import { EPayService } from '../shared/epay.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FQ000402ApiService } from '@api/fq/fq000402/fq000402-api.service';
import { FQ000402ReqBody } from '@api/fq/fq000402/fq000402-req';
import { AuthService } from '@core/auth/auth.service';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { FormateService } from '@shared/formate/formate.service';
@Component({
  selector: 'app-setacct',
  templateUrl: './setacct.component.html',
  styleUrls: ['./setacct.component.css']
})
export class SetacctComponent implements OnInit {

  AcctInfo = {
    cardNo: '',
    acctNo: [],
    trnsfrOutAccnt: '',
    cardEncrypt: '',
    phoneNo: ''
  };

  onePage = true;
  resultData: any;
  resultError = '';

  // 錯誤檢核
  errorMsg = {
    cardEncrypt: '',
    phoneNo: ''
  };

  constructor(
    private epay: EPayService,
    private alert: AlertService,
    private navgator: NavgatorService,
    private handleError: HandleErrorService,
    private fq000402: FQ000402ApiService,
    private auth: AuthService
    , private _formateService: FormateService
  ) { }

  ngOnInit() {
    this.sendFQ000101AndF5000101();
  }

  async sendFQ000101AndF5000101() {
    try {
      const fq000101Data: any = await this.epay.sendFQ000101('T');
      const f5000101Data: any = await this.epay.sendF5000101('B', { type: '2', currency: 'TWD' });
      if (typeof fq000101Data.mobileBarcode === 'undefined' || fq000101Data.mobileBarcode === '') {
        this.alert.show('無發票載具條碼資訊,請先查詢或註冊您的發票載具條碼').then(
          res => {
            this.navgator.push('invoice');
          }
        );
      } else if (f5000101Data.trnsOutAccts.length === 0) {
        this.alert.show('銀行帳號查詢失敗').then(
          res => {
            this.navgator.push('epay');
          }
        );
      } else {
        this.AcctInfo.cardNo = fq000101Data.mobileBarcode;
        this.AcctInfo.acctNo = f5000101Data.trnsOutAccts;
        this.AcctInfo.trnsfrOutAccnt = this.AcctInfo.acctNo[0].trnsfrOutAccnt;
      }
    } catch (error) {
      this.handleError.handleError(error);
    }
  }

  clickSubmit() {
    this.phoneCheck();
    this.customerCheck();
    // tslint:disable-next-line: curly
    if (this.errorMsg.phoneNo !== '' || this.errorMsg.cardEncrypt !== '') return;
    const form = new FQ000402ReqBody();
    // form.custId = this.auth.userInfo.custId;
    // form.bankNo = '006';
    form.acctNo = this.AcctInfo.trnsfrOutAccnt;
    form.mobileBarcode = this.AcctInfo.cardNo;
    form.verifyCode = this.AcctInfo.cardEncrypt;
    form.winnerPhone = this.AcctInfo.phoneNo;
    this.fq000402.send(form)
      .then(
        (fq000402res) => {
          this.onePage = false;
          this._modifyRes(fq000402res);
          // this.resultData = fq000402res;
          // this.resultError = this.resultData.msg;
          // if (!!this.resultData.hostCodeMsg) {
          //   this.resultError = this.resultData.hostCodeMsg;
          // } else if (!!this.resultData.trnsRsltCodeMsg) {
          //   this.resultError = this.resultData.trnsRsltCodeMsg;
          // }
        })
      .catch((errorObj) => {
        errorObj['type'] = 'message';
        errorObj['title'] = '設定領獎帳號 綁定失敗';
        this.handleError.handleError(errorObj);
        // this.handleError.handleError({
        //   type: 'dialog',
        //   title: 'ERROR.TITLE',
        //   content: '設定領獎帳號 綁定失敗'
        // });
      });
  }

  clickClear() {
    this.AcctInfo.cardEncrypt = '';
    this.AcctInfo.phoneNo = '';
  }

  Check() {
    this.navgator.push('epay');
  }

  phoneCheck() {
    this.errorMsg.phoneNo = '';
    if (this.AcctInfo.phoneNo === '') {
      this.errorMsg.phoneNo = '請輸入手機號碼';
      return;
    }
    let res = /^[0-9]*$/;
    if (!res.test(this.AcctInfo.phoneNo)) {
      this.errorMsg.phoneNo = '手機號碼須為數字';
      return;
    }
    const check_phone = UserCheckUtil.checkMobile(this.AcctInfo.phoneNo);
    if (check_phone.status) {
      this.errorMsg.phoneNo = '';
    } else {
      this.errorMsg.phoneNo = check_phone.msg;
    }
  }

  customerCheck() {
    this.errorMsg.cardEncrypt = '';
    if (this.AcctInfo.cardEncrypt === '') {
      this.errorMsg.cardEncrypt = '請輸入驗證碼';
      return;
    }
    if (this.AcctInfo.cardEncrypt.length < 4 || this.AcctInfo.cardEncrypt.length > 16) {
      this.errorMsg.cardEncrypt = '驗證碼長度需 4~16 碼';
      return;
    }
  }


  private _modifyRes(resObj) {
    let info_data = [];
    let res_body = resObj.body;
    let tmp_data: any;
    let res_title = '領獎帳號設定失敗';
    if (resObj.status) {
      res_title = '領獎帳號設定成功';
      // 手機條碼
      info_data.push({
        title: '手機條碼',
        content: this.AcctInfo.cardNo
      });
      // 銀行帳號
      info_data.push({
        title: '銀行帳號',
        content: this.AcctInfo.trnsfrOutAccnt
      });
      // 聯絡電話
      info_data.push({
        title: '聯絡電話',
        content: this.AcctInfo.phoneNo
      });
    } else {
      // 錯誤代碼
      info_data.push({
        title: 'EPAY.FIELD.hostCode',
        content: this._formateService.checkField(resObj, 'hostCode')
      });
      // 主機代碼訊息
      tmp_data = this._formateService.checkField(resObj, 'hostCodeMsg');
      if (resObj.trnsRsltCode.indexOf('RSPERR') > -1) {
        tmp_data = resObj.msg;
      }
      info_data.push({
        title: '代碼訊息',
        content: tmp_data
      });
    }
    this.resultData = {
      title: res_title, // 結果狀態
      content_params: {}, // 副標題i18n
      content: resObj.msg, // 結果內容
      classType: resObj.classType, // 結果樣式
      detailData: info_data,
      button: 'EPAY.FIELD.BACK_EPAY', // 返回合庫E Pay
      buttonPath: 'epay',
      leftBtnIcon: 'back'
    };
  }


}
