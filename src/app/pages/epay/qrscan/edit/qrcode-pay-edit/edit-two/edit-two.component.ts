import { Component, OnInit } from '@angular/core';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { EPayService } from '@pages/epay/shared/epay.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FQ000105ApiService } from '@api/fq/fq000105/fq000105-api.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-edit-two',
  templateUrl: './edit-two.component.html',
  styleUrls: ['./edit-two.component.css']
})
export class EditTwoComponent implements OnInit {

  securityTypes: any = [];
  qrcodeObj: any;
  trnsLimitAmt: any;
  ParamsObj: any;
  form: any;
  accts: any = [];
  defaultTrnsOutAcct: any;
  disableAmountInput: any;
  disableOrderNumberInput: any;
  // selectSecurityType: any;
  act: any;
  paymentData: any;
  //錯誤訊息
  errorMsg = {
    trnsAmount: '',
    orderNumber: '',
    security: '',
    acct: ''
  };
  //錯誤flag
  errorFlag = {
    trnsAmount: false,
    orderNumber: false,
    security: false,
    acct: false
  }
  //綁ngModel 選擇安控使用
  onSelectObj = {
    security: ''
  };
  //綁ngModel,選擇交易帳號使用
  onAcctObj = {
    acct: ''
  };
  // select_securityTypes: any = [];
  selectSecurityType: any = {};
  security_obj = {
    NONSET: '憑證',
    Biometric: '快速交易'
  };
  constructor(
    private qrcodeService: QRTpyeService,
    private navgator: NavgatorService,
    private auth: AuthService,
    private epay: EPayService,
    private alert: AlertService,
    private handleError: HandleErrorService,
    private fq000105: FQ000105ApiService,
    private _logger: Logger,
    private qrtype: QRTpyeService
  ) { }

  // ngOnInit() {
  // }

  ngOnInit() {

    // 安控資料取得
    let security_data = this.qrtype.getSecurityData();
    this.securityTypes = security_data.securityTypes;
    if (!!security_data.selectSecurityType) {
      this.onChangeSecurity(security_data.selectSecurityType);
    }
    logger.error('Epay', 'security:', this.securityTypes, this.selectSecurityType);

    this.ParamsObj = this.navgator.getParams();
    this.qrcodeObj = this.ParamsObj.qrcode;
    this.trnsLimitAmt = this.ParamsObj.trnsLimitAmt;
    logger.error("securityTypes:", this.securityTypes);
    logger.error("selectSecurityType:",this.selectSecurityType);

    this.form = {
      trnsfrOutAcct: this.ParamsObj.trnsfrOutAcct
      , secureCode: this.ParamsObj.qrcode.secureCode
      , acqInfo: this.ParamsObj.qrcode.acqInfo
    };
    logger.error("form:", this.form);

    let res = this.auth.getUserInfo();
    this.epay.sendFQ000101('A').then(
      resFQ000101 => {
        logger.error("sendFQ000101 success, resFQ000101:", resFQ000101);
        let result: any = resFQ000101;
        // 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
        if (result.trnsOutAccts == null
          || result.trnsOutAccts.trnsOutAcct == null) {
          this.alert.show('未開通晶片金融卡，請臨櫃申請', {
            title: '提醒您',
            btnTitle: '我知道了',
          }).then(
            () => {
              this.navgator.push('epay');
            }
          );
        }
        let acts = result.trnsOutAccts.trnsOutAcct;
        acts = ObjectCheckUtil.modifyTransArray(result.trnsOutAccts.trnsOutAcct);
        logger.error("sendFQ000101 acts:", acts);
        // 取得進行SmartPay開通功能開關
        this.accts = [];
        // for (let key in acts) {
        //   // 檢查是否為預設SmartPay帳戶
        //   if (acts[key].acctNo == result.defaultTrnsOutAcct) {
        //     acts[key].selected = true;
        //   }
        //   this.accts.push(acts[key]);
        // }

        // 檢查是否為預設SmartPay帳戶
        acts.forEach(item_acct => {
          if (item_acct.acctNo == result.defaultTrnsOutAcct) {
            item_acct['selected'] = true;
          } else {
            item_acct['selected'] = false;
          }
          this.accts.push(item_acct);
        });

        logger.error("default accts:", this.accts);
        if (this.accts.length === 0) {
          this.alert.show('未開通晶片金融卡，請臨櫃申請', {
            title: '提醒您',
            btnTitle: '我知道了',
          }).then(
            () => {
              this.navgator.push('epay');
            }
          );
        }
        //將101回傳 預設轉出帳號 存取變數
        this.defaultTrnsOutAcct = result.defaultTrnsOutAcct;
      },
      errorFQ000101 => {
        logger.error("sendFQ000101 error, errorFQ000101:", errorFQ000101);
        this.handleError.handleError(errorFQ000101);
      }
    );

    if (this.ParamsObj.qrcode.txnAmt != null && this.ParamsObj.qrcode.txnAmt != '' && typeof (this.ParamsObj.qrcode.txnAmt) != 'object') {
      // tslint:disable-next-line: radix
      this.form.trnsAmount = parseInt(this.ParamsObj.qrcode.txnAmt) / 100;
      this.disableAmountInput = true;
    }
    // 訂單編號(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.orderNbr != null && typeof (this.ParamsObj.qrcode.orderNbr) != 'object') {
      this.form.orderNumber = this.ParamsObj.qrcode.orderNbr;
      this.disableOrderNumberInput = true;
    }
    // 交易幣別(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.txnCurrencyCode != null && typeof (this.ParamsObj.qrcode.txnCurrencyCode) != 'object') {
      this.form.txnCurrencyCode = this.ParamsObj.qrcode.txnCurrencyCode;
    }

    // QRCode效期(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.qrExpirydate != null && typeof (this.ParamsObj.qrcode.qrExpirydate) != 'object') {
      this.form.qrExpirydate = this.ParamsObj.qrcode.qrExpirydate;
    }
  }

  // onAct(e) {
  //   this.act = this.accts[e.target.selectedIndex];
  //   logger.error("onchange act:",this.act);
  // }

  onChangeSecurity(security) {
    this.selectSecurityType = security;
    // logger.error("onChangeSecurity(), selectSecurityType:",this.selectSecurityType);
  }

  /**
		* 點選確認
		*/
  clickSubmit() {
    // this.securityTypes['name'] = this.onSelectObj.security;
    // this.securityTypes['key'] = this.onSelectObj.security;
    logger.error("clickSubmit(), form:", this.form);
    let params = {
      qrcode: this.qrcodeObj,
      paymentData: this.form,
      securityType: this.securityTypes
    };
    //檢核金額
    if (this.form.trnsAmount == '' || this.form.trnsAmount == null) {
      logger.error("into trnsAmount empty error");
      logger.error("into trnsAmount empty error, form.trnsAmount:", this.form.trnsAmount);
      this.errorFlag.trnsAmount = true;
      this.errorMsg.trnsAmount = '請輸入交易金額';
    } else if (this.form.trnsAmount > 100000 && this.form.trnsAmount !== null) {
      logger.error("into trnsAmount error");
      logger.error("into trnsAmount error, form.trnsAmount:", this.form.trnsAmount);
      this.errorFlag.trnsAmount = true;
      this.errorMsg.trnsAmount = '本交易超過單筆最高限額';
    } else {
      this.errorFlag.trnsAmount = false;
      this.errorMsg.trnsAmount = '';
    }
    //檢核訂單編號
    if (this.form.orderNumber == '' || this.form.orderNumber == null) {
      logger.error("into orderNumber empty error");
      logger.error("into orderNumber empty error, form.orderNumber:", this.form.orderNumber);
      this.errorFlag.orderNumber = true;
      this.errorMsg.orderNumber = '請輸入訂單編號';
    } else {
      this.errorFlag.orderNumber = false;
      this.errorMsg.orderNumber = '';
    }
    //檢核交易編號
    if (this.onAcctObj.acct == '' || this.onAcctObj.acct == null) {
      logger.error("into acct empty error");
      logger.error("into acct empty error, onAcctObj.acct:", this.onAcctObj.acct);
      this.errorFlag.acct = true;
      this.errorMsg.acct = '請選擇交易帳號';
    } else {
      this.errorFlag.acct = false;
      this.errorMsg.acct = '';
    }
    //全部過才進行下一個流程
    if (this.form.trnsAmount == '' || this.form.trnsAmount == null
      || this.form.orderNumber == '' || this.form.orderNumber == null
      || this.onAcctObj.acct == '' || this.onAcctObj.acct == null) {
      return false;
    }

    // 檢查單日限額
    let limit = parseInt(this.trnsLimitAmt) / 100;
    if (this.form.trnsAmount > limit) {
      this.alert.show('本交易超過單筆交易限額', {
        title: '提醒您',
        btnTitle: '我知道了',
      }).then(
        () => {
          this.navgator.push('epay');
        }
      );
    }
    this.paymentData = this.form;
    logger.error("clickSubmit(), paymentData:", this.paymentData);
    let formObj = { ...this.paymentData };
    formObj.custId = this.auth.getUserInfo().custId;
    formObj.trnsAmount = this.form.trnsAmount * 100;
    formObj.merchantName = encodeURI(this.qrcodeObj.merchantName);
    formObj.mobileBarcode = '';
    let reqponse = {
      custId: formObj.custId,
      trnsfrOutAcct: formObj.trnsfrOutAcct,
      orderNumber: formObj.orderNumber,
      trnsAmount: formObj.trnsAmount,
      secureCode: formObj.secureCode,
      txnCurrencyCode: formObj.txnCurrencyCode,
      acqInfo: formObj.acqInfo,
      qrExpirydate: formObj.qrExpirydate,
      trnsToken: '',
      merchantName: formObj.merchantName,
      mobileBarcode: formObj.mobileBarcode
    };
    const CA_Object = {
      securityType: '',
      serviceId: 'FQ000105',
      signText: reqponse,
      otpObj: {
        custId: '',
        fnctId: '',
        depositNumber: '',
        depositMoney: '',
        OutCurr: '',
        transTypeDesc: ''
      }
    };
    logger.error("securityTypes:", this.securityTypes);
    logger.error("CA_Object:", CA_Object);
    logger.error("selectSecurityType:",this.selectSecurityType);
    this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
      resSecurityInfo => {
        let reqHeader = {
          header: resSecurityInfo.headerObj
        };

        logger.error('resSecurityInfo', resSecurityInfo);
        this.fq000105.send(resSecurityInfo.responseObj.signText, reqHeader).then(
          (res) => {
            logger.error("fq000105() success, res:", res);
            if (!this.qrcodeService.isCheckResponse(res)) {
              // this.handleError.handleError({
              //   type: 'dialog',
              //   title: 'ERROR.TITLE',
              //   content: '(' + res.body.hostCode + ')' + res.body.hostCodeMsg
              // });
              // this.clickCancel();
              // return;

              //如果交易失敗 導頁至結果頁，並顯示交易失敗
              let params = {
                qrcode: this.qrcodeObj,
                result: res,
              };
              this.navgator.push('qrcodePayResult', params);
            }
            let params = {
              qrcode: this.qrcodeObj,
              result: res,
              means: 'financial',
              detail: 'qrcodePayResult',
              merchantName: this.qrcodeObj.merchantName
            };
            this.navgator.push('qrcodePayResult', params);
          }).
          catch(
            error => {
              logger.error("fq000105() error, error:", error);
              this.handleError.handleError(error);
            });
      },
      errorSecurityInfo => {
        logger.debug('errorSecurityInfo');
        logger.error('errorSecurityInfo:', errorSecurityInfo);
      },
    );
  }

  clickCancel() {
    this.navgator.push('epay');
  }
}
