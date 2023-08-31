import { Component, OnInit } from '@angular/core';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FC001001ApiService } from '@api/fc/fc001001/fc001001-api.service';
import { FQ000201ApiService } from '@api/fq/fq000201/fq000201-api.service';
import { FQ000202ApiService } from '@api/fq/fq000202/fq000202-api.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';
import { CheckService } from '@shared/check/check.service';
import { FQ000202ReqBody } from '@api/fq/fq000202/fq000202-req';
import { FQ000201ReqBody } from '@api/fq/fq000201/fq000201-req';
@Component({
  selector: 'app-edit-tax-two',
  templateUrl: './edit-tax-two.component.html',
  styleUrls: ['./edit-tax-two.component.css']
})
export class EditTaxTwoComponent implements OnInit {

  securityTypes: any;
  selectSecurityType: any;
  ParamsObj: any;
  qrcode: {
    accts: '',
    cardds: '',
    payNo: any,
    payCategory: any,
    payCategory1: '',
    merchantName: '',
    periodCode: '',
    identificationCode: '',
    payEndDate1: ''
    trnsAmountStr: ''
  };
  trnsLimitAmt: any;
  accts: any;
  cardds: any;
  status = 0;
  form: any;
  form2: any;
  form3: any;
  acts: any;
  cards: any;
  card = '';
  life = '';
  paymentData: any;
  errorMsg = {
    cardDate: '',
    cardPassword: '',
    mobileNumber: '',
    trnsAmount: '',
    orderNumber: ''
  };
  constructor(
    private qrcodeService: QRTpyeService,
    private navgator: NavgatorService,
    private auth: AuthService,
    private f4000101: F4000101ApiService,
    private handleError: HandleErrorService,
    private alert: AlertService,
    private fc001001: FC001001ApiService,
    private confirm: ConfirmService,
    private fq000201: FQ000201ApiService,
    private fq000202: FQ000202ApiService,
    private _logger: Logger,
    private _errorCheck: CheckService
  ) { }

  ngOnInit() {
    this._init();
  }

  _init() {

		// 安控資料取得
		let security_data = this.qrcodeService.getSecurityData();
		this.securityTypes = security_data.securityTypes;
		if (!!security_data.selectSecurityType) {
			this.onChangeSecurity(security_data.selectSecurityType);
		}
    this.ParamsObj = this.navgator.getParams();
    this.qrcode = this.ParamsObj.qrcode;
    this.trnsLimitAmt = this.ParamsObj.trnsLimitAmt;
    this.status = null;		// select radio account
    this.accts = this.qrcode.accts;		// 活期儲蓄存款帳戶列表
    this.cardds = this.qrcode.cardds; 		// 信用卡列表

    this.form = {
      trnsfrOutAcct: this.ParamsObj.trnsfrOutAcct
      , secureCode: this.ParamsObj.qrcode.secureCode
      , acqInfo: this.ParamsObj.qrcode.acqInfo
    };
    this.form2 = {};
    this.form3 = {};
    // 繳款類別(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.payCategory !== null && typeof (this.ParamsObj.qrcode.payCategory) !== 'object') {
      this.form.payCategory = this.ParamsObj.qrcode.payCategory;
      if (this.form.payCategory == '11331') {
        this.form.businessType = 'T';
      }
    }
    // 交易幣別(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.payNo !== null && typeof (this.ParamsObj.qrcode.payNo) !== 'object') {
      this.form.payNo = this.ParamsObj.qrcode.payNo;
    }

    if (this.ParamsObj.qrcode.payEndDate !== null && typeof (this.ParamsObj.qrcode.payEndDate) !== 'object') {
      this.form.payEndDate = this.ParamsObj.qrcode.payEndDate;
      // this.disableOrderNumberInput = true;
    }
    // 交易幣別(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.trnsAmountStr !== null && typeof (this.ParamsObj.qrcode.trnsAmountStr) !== 'object') {
      this.form.trnsAmountStr = this.ParamsObj.qrcode.trnsAmountStr;
    }

    // 識別碼(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.identificationCode !== null && typeof (this.ParamsObj.qrcode.identificationCode) !== 'object') {
      this.form.identificationCode = this.ParamsObj.qrcode.identificationCode;
    }

    // 期別代碼(針對可能為空值特別處理)
    if (this.ParamsObj.qrcode.periodCode !== null && typeof (this.ParamsObj.qrcode.periodCode) !== 'object') {
      this.form.periodCode = this.ParamsObj.qrcode.periodCode;
    }
    // this.clickAccts();
    // this.clickCard();
    this.status = 1;
  }
  chgStatus(status) {
		if (status == '2') {
			this.clickAccts();
		} else if (status == '3') {
			this.clickCard();
		}
	}
	onChangeSecurity(security) {
		this.selectSecurityType = security;
	}

  clickAccts() {
    let custId = this.auth.getCustId();
    this.form2.custId = custId;
    // 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
    this.f4000101.send(this.form2).then(
      res4000101 => {
        this._logger.step('Epay', '測試res4000101: ', res4000101);
        if (res4000101.trnsOutAccts == null) {
          this.alert.show('未開活期存款帳戶，請臨櫃申請').then(
            res_alert => {
              this.navgator.push('epay');
            }
          );
        }
        this._logger.step('Epay', '測試res4000101: ', res4000101.body);
        this.acts = res4000101.trnsOutAccts;
        this.acts = ObjectCheckUtil.modifyTransArray(res4000101.trnsOutAccts);
        this.accts = [];
        for (let key in this.acts) {
          this.accts.push(this.acts[key]);
        }
        this._logger.step('Epay', '測試accts: ', this.accts);
        this.accts.forEach(element => {
          this._logger.step('Epay', '測試印出element:', element.acctNo);
        });
      },
      error => {
        this.handleError.handleError(error);
      });
  }

  clickCard() {
    let custId = this.auth.getCustId();
    this.form3.custId = custId;
    this.form3.appInputFlag = '1';
    this.form3.pageSize = '50';
    this.fc001001.getData(this.form3).then(
      (resfc001001) => {
        if (resfc001001.data == null) {
          this.alert.show('未開活期存款帳戶，請臨櫃申請').then(
            res_alert => {
              this.navgator.push('epay');
            }
          );
        }
        this.cards = resfc001001.data;
        this.cardds = [];
        for (let key in this.cards) {
          let jj = (JSON.stringify(this.cards[key].creditCardNo)).substring(1, 7);
          if (jj != '540520' && jj != '405430') {
            this.cardds.push(this.cards[key]);
          }
        }


        // if (resfc001001.body.details == null
        //   || resfc001001.body.details.detail == null) {
        //   this.alert.show('未開活期存款帳戶，請臨櫃申請').then(
        //     res_alert => {
        //       this.navgator.push('epay');
        //     }
        //   );
        // }
        // this.cards = resfc001001.body.details.detail;
        // this.cards = ObjectCheckUtil.modifyTransArray(resfc001001.body.details.detail);
        // this.cardds = [];
        // for (let key in this.cards) {
        //   let jj = (JSON.stringify(this.cards[key].creditCardNo)).substring(1, 7);
        //   if (jj != '540520' && jj != '405430') { this.cardds.push(this.cards[key]); }
        // }
      },
      (errorfc001001) => {
        this.handleError.handleError(errorfc001001);
      });
    // this.fc001001.send(this.form3).then(
    //   resfc001001 => {
    //     if (resfc001001.body.details == null
    //       || resfc001001.body.details.detail == null) {
    //       this.alert.show('未開活期存款帳戶，請臨櫃申請').then(
    //         res_alert => {
    //           this.navgator.push('epay');
    //         }
    //       );
    //     }
    //     this.cards = resfc001001.body.details.detail;
    //     this.cards = ObjectCheckUtil.modifyTransArray(resfc001001.body.details.detail);
    //     this.cardds = [];
    //     for (let key in this.cards) {
    //       let jj = (JSON.stringify(this.cards[key].creditCardNo)).substring(1, 7);
    //       if (jj != '540520' && jj != '405430') { this.cardds.push(this.cards[key]); }
    //     }
    //   },
    //   errorfc001001 => {
    //     this.handleError.handleError(errorfc001001);
    //   }
    // );
  }

  clickSubmit() {
    let params = {
      qrcode: this.qrcode,
      paymentData: this.form,
      securityType: this.securityTypes
    };
    // this._logger.step('Epay', '測試印出params:', params);
    // this._logger.step('Epay', '測試印出status:', this.status);
    // this._logger.step('Epay', '測試印出accts:', this.accts);
    // this._logger.step('Epay', '測試印出cardds:', this.cardds);
    // this._logger.step('Epay', '測試印出card:', this.card);
    // this._logger.step('Epay', '測試印出cardDate:', this.form.cardDate);
    // this._logger.step('Epay', '測試印出cardPassword:', this.form.cardPassword);
    // this._logger.step('Epay', '測試印出life:', this.life);
    // this._logger.step('Epay', '測試印出form.trnsfrOutAcct:', this.form.trnsfrOutAcct);
    // this._logger.step('Epay', '測試印出acts:', this.acts);
    // this._logger.step('Epay', '開始');
    // 沒有選擇繳款方式情況
    if (this.status === null) {
      this._logger.step('Epay', '請選擇繳款方式');
      this.alert.show('請選擇繳款方式');
    } else if (this.status == 2 && this.accts === null) {
      // 活期
      this._logger.step('Epay', '您目前尚未設定約定轉出帳戶，請改以其它方式繳款');
      this.alert.show('您目前尚未設定約定轉出帳戶，請改以其它方式繳款');
    } else if (this.status == 2 && this.accts !== null && this.life === null) {
      this._logger.step('Epay', '請選擇活期存款帳戶');
      this.alert.show('請選擇活期存款帳戶');
    } else if (this.status == 3 && this.cardds === null) {
      // 信用卡
      this._logger.step('Epay', '您目前無本行信用卡，請改以其它方式繳款');
      this.alert.show('您目前無本行信用卡，請改以其它方式繳款');
    } else if (this.status == 3 && this.cardds !== null && this.card === null) {
      this._logger.step('Epay', '請選擇信用卡');
      this.alert.show('請選擇信用卡');
      // tslint:disable-next-line: max-line-length
    } else if (this.status == 3 && this.cardds !== null && this.card !== null && (this.form.cardDate === null || this.form.cardDate === '')) {
      this._logger.step('Epay', '請輸入信用卡有效月年:');
      this.errorMsg.cardDate = '請輸入信用卡有效月年';
      // tslint:disable-next-line: max-line-length
    } else if (this.status == 3 && this.cardds !== null && this.card !== null && (this.form.cardPassword === null || this.form.cardPassword === '')) {
      this._logger.step('Epay', '請輸入信用卡背面末三碼');
      this.errorMsg.cardPassword = '請輸入信用卡背面末三碼';
    } else if (this.status == 3 && this.card !== null && this.form.cardDate !== null && this.form.cardPassword) {
      this._logger.step('Epay', '執行FQ000201');
      // 執行FQ000201
      let message = '除每年5月綜合所得稅結算申報自繳稅款案件，得於法定(或依法展延)申報截止日前取消授權外，其餘案件一經授權成功，不得取消或更正。\n您可按「確認」繼續繳款，或按「取消」放棄繳款';
      this.confirm.show(message).then(
        reschecked => {
          this._logger.step('Epay', '測試印出FQ000201:', reschecked);
          this.paymentData = this.form;
          let info = this.auth.getUserInfo();
          this.paymentData.custId = this.auth.getCustId();
          let formObj = { ...this.paymentData };
          formObj.trnsAmount = this.form.trnsAmount * 100;
          formObj.merchantName = encodeURI(this.qrcode.merchantName);
          formObj.cardNo = this.card;
          formObj.taxNo = '';
          formObj.cityId = '';
          formObj.expiredDate = this.form.cardDate;
          formObj.checkId = this.form.cardPassword;
          formObj.taxMonth = this.qrcode.periodCode;

          let respon = new FQ000201ReqBody();
          respon.custId = formObj.custId;
          respon.cardNo = formObj.cardNo;
          respon.expiredDate = formObj.expiredDate;
          respon.trnsAmountStr = formObj.trnsAmountStr + '';
          respon.payCategory = formObj.payCategory;
          respon.payNo = formObj.payNo;
          respon.taxNo = formObj.taxNo;
          respon.taxMonth = formObj.taxMonth;
          respon.checkId = formObj.checkId;
          respon.cityId = formObj.cityId;
          respon.payEndDate = formObj.payEndDate;
          logger.error('respon 201', respon);
          const CA_Object = {
            securityType: '',
            serviceId: 'FQ000201',
            signText: respon,
            otpObj: {
              custId: '',
              fnctId: '',
              depositNumber: '',
              depositMoney: '',
              OutCurr: '',
              transTypeDesc: ''
            }
          };
          this._logger.step('Epay', '測試印出CA_Object:', CA_Object);
          // this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
          //   resSecurityInfo => {
          //     let reqHeader = {
          //       header: resSecurityInfo.headerObj
          //     };
          this.fq000201.send(respon).then(
            (resfq000201) => {
              this._logger.step('Epay', '測試印出resfq000201:', resfq000201);
              if (!this.qrcodeService.isCheckResponse(resfq000201)) {
                this.handleError.handleError({
                  type: 'message',
                  title: 'ERROR.TITLE',
                  content:  (resfq000201.body.hostCode == undefined|| resfq000201.body.hostCode == '')? '':
									('(' +  resfq000201.body.hostCode + ')')+ resfq000201.body.hostCodeMsg
                });
                // this.clickCancel();
                // return;
              }
              resfq000201.body.num = 11; // 用來辨識11類銷帳編號
              resfq000201.body.payId = this.auth.getCustId();
              // tslint:disable-next-line: no-shadowed-variable
              let params = {
                qrcode: this.qrcode,
                result: resfq000201,
                means: 'financial',
                detail: 'qrcodePayTaxResult'
              };
              this._logger.step('Epay', '測試印出resfq000201:', params);
              this.navgator.push('qrcodePayResult', params);
            }).
            catch(
              error => {
                this.handleError.handleError(error);
              });
        },
        errorSecurityInfo => {
          logger.debug('errorSecurityInfo');
        }
      );

    } else if (this.status == 1 || (this.status == 2 && this.life != null)) {
      this.paymentData = this.form;
      let info = this.auth.getUserInfo();
      if (this.selectSecurityType.key === 'NONSET' && (info.cn == null || info.cn == '')) {
        this.alert.show('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。');
        return;
      }
      this.paymentData.custId = this.auth.getCustId();
      let formObj = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
      formObj.trnsAmount = this.form.trnsAmount * 100;
      // debugger;
      if (this.status == 2) { this.form.trnsfrOutAcct = this.acts[this.life].acctNo; }
      formObj.taxNo = ''; // 營業稅稅籍編號 （其它稅款空白）
      formObj.cityId = ''; // 縣市代碼（綜所稅空白）
      formObj.checkId = this.qrcode.identificationCode;
      formObj.taxMonth = this.qrcode.periodCode;
      if (this.status == 1) {
        formObj.paymentTool = '0';
      } else {
        // 繳款工具
        formObj.paymentTool = '1';
      }
      this._logger.step('Epay', '檢查執行FQ000202(formObj): ', formObj);
      let respon = new FQ000202ReqBody();
      respon.custId = formObj.custId;
      respon.paymentTool = formObj.paymentTool;
      respon.trnsToken = '';
      respon.trnsfrOutAcct = formObj.trnsfrOutAcct;
      respon.trnsAmountStr = formObj.trnsAmountStr;
      respon.payCategory = formObj.payCategory;
      respon.payNo = formObj.payNo;
      respon.taxNo = formObj.taxNo;
      respon.taxMonth = formObj.taxMonth;
      respon.checkId = formObj.checkId;
      respon.cityId = formObj.cityId;
      respon.payEndDate = formObj.payEndDate;
      respon.payId = this.auth.getCustId();

      this._logger.step('Epay', '檢查執行FQ000202(respon): ', respon);
      const CA_Object = {
        securityType: '',
        serviceId: 'FQ000202',
        signText: respon,
        otpObj: {
          custId: '',
          fnctId: '',
          depositNumber: '',
          depositMoney: '',
          OutCurr: '',
          transTypeDesc: ''
        }
      };
      this._logger.step('Epay', '測試印出CA_Object:', CA_Object);
      this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
        resSecurityInfo => {
          let reqHeader = {
            header: resSecurityInfo.headerObj
          };
          this.fq000202.send(resSecurityInfo.responseObj.signText, reqHeader).then(
            (resfq000202) => {
              if (!this.qrcodeService.isCheckResponse(resfq000202)) {
                this.handleError.handleError({
                  type: 'message',
                  title: 'ERROR.TITLE',
                  content: (resfq000202.body.hostCode != undefined && resfq000202.body.hostCode != '') ?
                    ('(' + resfq000202.body.hostCode + ')') : '' + resfq000202.body.hostCodeMsg
                });
                // this.clickCancel();
                // return;
              }
              // resfq000202.body.payId = this.auth.getCustId();
              resfq000202.body.num = 11; // 用來辨識11類銷帳編號
              resfq000202.body.payId = this.auth.getCustId();
              // tslint:disable-next-line: no-shadowed-variable
              let params = {
                qrcode: this.qrcode,
                result: resfq000202,
                means: 'financial',
                detail: 'qrcodePayTaxResult'
              };
              this._logger.step('Epay', '測試印出resfq000202:', params);
              this.navgator.push('qrcodePayResult', params);
            }).
            catch(
              error => {
                this.handleError.handleError(error);
              });
        },
        errorSecurityInfo => {
          logger.debug('errorSecurityInfo');
        }
      );
    }
    // this._logger.step('Epay', '不做任何事');
  }
  clickCancel() {
    this.navgator.push('epay');
  }

  checkFormat(type, content) {
    const check_obj = this._errorCheck.checkNumber(content); // 數字檢核
    let resultMsg = '';
    if (check_obj.status) {
      resultMsg = '';
    } else {
      resultMsg = check_obj.msg;
    }
    if (type == 'cardDate') {
      this.errorMsg.cardDate = resultMsg;
    } else if (type == 'cardPassword') {
      this.errorMsg.cardPassword = resultMsg;
    }
  }
}
